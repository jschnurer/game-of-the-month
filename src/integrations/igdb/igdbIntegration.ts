import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import https from 'https';
import { TwitchAuthTokenSingleton } from '../twitch/twitchIntegration';
import settings from '~/settings/settings';
import IIGDBGame from '~/shared/types/IIGDBGame';

export async function searchGamesByName(name: string): Promise<IIGDBGame[]> {
  const token = await TwitchAuthTokenSingleton.getInstance().getToken();

  const query = `
    search "${name}";
    fields id, name, summary, url, cover.url, first_release_date, release_dates.date, release_dates.platform.name, release_dates.region;
    limit 20;
  `;
  const response = await fetch(settings.igdb.gamesUrl, {
    method: 'POST',
    headers: {
      'Client-ID': settings.twitch.clientId,
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}`);
  }

  const searchResults = await response.json() as IIGDBGame[];

  searchResults.forEach(game => {
    game.first_release_platform = game.release_dates
      ?.find(rd => rd.date === game.first_release_date)
      ?.platform.name || 'Unknown';
  });

  return searchResults;
}

const writeFileAsync = promisify(fs.writeFile);

export async function downloadCoverArt(coverUrl: string, coverFilename: string): Promise<string> {
  const publicDir = path.resolve(process.cwd(), 'public', 'covers');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const filePath = path.join(publicDir, coverFilename);

  return new Promise((resolve, reject) => {
    https.get(coverUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${coverUrl}' (${res.statusCode})`));
        return;
      }
      const data: Uint8Array[] = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', async () => {
        try {
          await writeFileAsync(filePath, Buffer.concat(data));
          resolve(filePath);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}