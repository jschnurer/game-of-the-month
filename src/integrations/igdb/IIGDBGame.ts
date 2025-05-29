export interface IIGDBGame {
  id: number,
  cover: {
    id: number,
    url: string,
  },
  first_release_date: number,
  first_release_platform: string,
  name: string,
  release_dates: [
    {
      id: number,
      date: number,
      platform: {
        id: number,
        name: string,
      },
      region: number
    },
    {
      id: number,
      date: number,
      platform: {
        id: number,
        name: string,
      },
      region: number
    },
    {
      id: number,
      date: number,
      platform: {
        id: number,
        name: string,
      },
      region: number
    }
  ],
  summary: string,
  url: string,
};