import ClubAccessibility from "./ClubAccessibility";

export default interface IClub {
  _id: string,
  name: string,
  accessibility: ClubAccessibility,
  owner: string,
  members: [],
}