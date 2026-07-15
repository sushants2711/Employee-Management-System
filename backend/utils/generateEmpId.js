import User from "../models/user.model.js";

const generateRandomString = (length) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const generateRandomNumber = (length) => {
  let result = "";
  const numbers = "0123456789";
  const numbersLength = numbers.length;
  for (let i = 0; i < length; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbersLength));
  }
  return result;
};

export const generateEmpId = async () => {
  let isUnique = false;
  let newEmpId = "";

  while (!isUnique) {
    const randomString = generateRandomString(3);
    const randomNum = generateRandomNumber(3);
    newEmpId = `${randomString}${randomNum}`;

    const existingUser = await User.findOne({ employeeId: newEmpId });

    if (!existingUser) {
      isUnique = true;
    }
  }

  return newEmpId;
};
