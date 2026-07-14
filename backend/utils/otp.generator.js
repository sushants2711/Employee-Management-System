import otpGenerator from "otp-generator";
import { OTP_LENGTH } from "../config/constant.js";

export const generateOTP = () => {
  return otpGenerator.generate(OTP_LENGTH, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};
