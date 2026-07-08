import bcrypt from "bcryptjs";

export const verifyPassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);