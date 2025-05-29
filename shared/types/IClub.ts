export default interface IClub {
  _id: string,
  name: string,
  slug: string,
  accessType: "Public" | "InviteOnly",
  description?: string,
  owner: string,
  members: [],
}