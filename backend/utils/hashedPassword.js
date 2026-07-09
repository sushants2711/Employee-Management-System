import bcrypt from "bcryptjs";

export const hashPassword = async (password) => bcrypt.hash(password, 10);
