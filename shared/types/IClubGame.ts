export default interface IClubGame {
  _id: string;
  name: string;
  platform?: string;
  releaseYear?: number;
  description: string;
  externalLink?: string;
  year: number;
  month: number;
  imageUrl?: string;
}