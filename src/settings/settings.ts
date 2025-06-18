import fs from "fs";
import path from "path";
import ISettings from "./ISettings";

// app.js (ESM)
import { fileURLToPath } from 'url';

// Rough equivalents of the old globals:
const __filename = fileURLToPath(import.meta.url);
export const __dirname  = path.dirname(__filename);

const settingsPath = path.resolve(__dirname, "../src/local.settings.json");

function loadSettings() {
  try {
    return JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
  } catch {
    return undefined;
  }
}

const handler: ProxyHandler<ISettings> = {
  get(_, prop) {
    const settings = loadSettings();
    if (settings && prop in settings) {
      return settings[prop as keyof typeof settings];
    }
    return undefined;
  },
  ownKeys() {
    const settings = loadSettings();
    return settings ? Reflect.ownKeys(settings) : [];
  },
  getOwnPropertyDescriptor(_, prop) {
    const settings = loadSettings();
    if (settings && prop in settings) {
      return {
        enumerable: true,
        configurable: true,
      };
    }
    return undefined;
  }
};

const settings = new Proxy({
  igdb: {
    coversUrl: "",
    gamesUrl: "",
  },
  mongoDb: {
    connectionString: "",
    db: "",
  },
  port: 0,
  twitch: {
    clientId: "",
    clientSecret: "",
    authUrl: "",
  },
}, handler);

export default settings;