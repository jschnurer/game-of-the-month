import fetch from 'node-fetch';
import { ITwitchAuthResponse } from './ITwitchAuthResponse';
import settings from '~/settings/settings';

export class TwitchAuthTokenSingleton {
  private static instance: TwitchAuthTokenSingleton;
  private tokenData: ITwitchAuthResponse | null = null;
  private tokenExpiresAt: number = 0;
  private fetchingPromise: Promise<ITwitchAuthResponse> | null = null;

  private constructor() { }

  public static getInstance(): TwitchAuthTokenSingleton {
    if (!TwitchAuthTokenSingleton.instance) {
      TwitchAuthTokenSingleton.instance = new TwitchAuthTokenSingleton();
    }
    return TwitchAuthTokenSingleton.instance;
  }

  public async getToken(): Promise<ITwitchAuthResponse> {
    const now = Date.now();

    if (this.tokenData && now < this.tokenExpiresAt) {
      return this.tokenData;
    }

    if (!this.fetchingPromise) {
      try {
        const authResponse = await this.getNewToken<ITwitchAuthResponse>();
        this.tokenData = authResponse;
        this.tokenExpiresAt = Date.now() + (authResponse.expires_in - 30) * 1000; // 30s buffer
        this.fetchingPromise = null;
        return authResponse;
      } catch (err) {
        this.fetchingPromise = null;
        throw err;
      }
    }

    return this.fetchingPromise;
  }

  private async getNewToken<ITwitchAuthResponse>(): Promise<ITwitchAuthResponse> {
    const response = await fetch(`${settings.twitch.authUrl}?client_id=${settings.twitch.clientId}&client_secret=${settings.twitch.clientSecret}&grant_type=client_credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<ITwitchAuthResponse>;
  }
}

export const twitchAuthTokenSingleton = TwitchAuthTokenSingleton.getInstance();