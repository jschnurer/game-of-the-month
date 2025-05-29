export default interface ISettings {
  mongoDb: {
    connectionString: string,
    db: string,
  },
  port: number,
  twitch: {
    clientId: string,
    clientSecret: string,
    authUrl: string,
  },
  igdb: {
    gamesUrl: string,
    coversUrl: string,
  }
}
