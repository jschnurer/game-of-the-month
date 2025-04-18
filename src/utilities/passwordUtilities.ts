import bcrypt from "bcrypt";

export function hashPassword(plainPassword: string) {
  return bcrypt.hashSync(plainPassword, 10);
}

export function comparePassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}