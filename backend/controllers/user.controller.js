import {
  sendSignupSuccessEmail,
  sendSignupVerificationEmail,
} from "../emails/email.send.js";
import userModel from "../models/user.model.js";
import { verifyPassword } from "../utils/comparePassword.js";
import { generateEmpId } from "../utils/generateEmpId.js";
import { hashPassword } from "../utils/hashedPassword.js";
import { generateOTP } from "../utils/otp.generator.js";
import {
  badRequestResponse,
  internalServerErrorResponse,
  successResponse,
} from "../utils/response.handler.js";
import { OTP_EXPIARY_TIME } from "../config/constant.js";
import { sendCookieToUser } from "../utils/send.cookie.js";

// management signup (usign email otp)
export const signupManagementController = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // check if the user is already exist using email or phone number
    const userExist = await userModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    // if already 5 management exist in company
    const managementCount = await userModel.countDocuments({
      role: "Management",
      isManagementVerified: true,
    });

    // if there is more than 5 management than return error
    if (managementCount >= 5) {
      return badRequestResponse(res, "Already 5 management exist in company");
    }

    // check if the email or phone number is exist than
    if (userExist) {
      // if email is already exist
      if (email !== userExist.email) {
        return badRequestResponse(res, "Email already exist");
      }

      // if phone number is already exist
      if (phoneNumber !== userExist.phoneNumber) {
        return badRequestResponse(res, "Phone number already exist");
      }

      // if user is verified than throw an error

      if (userExist.isManagementVerified) {
        return badRequestResponse(res, "Employee already exist");
      }

      // check the name of user
      if (name !== userExist.name) {
        userExist.name = name;
      }

      // check the password of user if its wrong than update the password
      const isValidPassword = await verifyPassword(
        password,
        userExist.password
      );

      // if password is wrong than update the password
      if (!isValidPassword) {
        const hashedPassword = await hashPassword(password);

        userExist.password = hashedPassword;
      }

      // if user is not verified than send otp again
      const otp = generateOTP();

      // save the otp first
      if (userExist) {
        userExist.managementOtp = otp;
        userExist.managementOtpExpiredTime =
          Date.now() + Number(OTP_EXPIARY_TIME); // otp expire in 5 minutes
      }

      const savedData = await userExist.save();

      if (!savedData) {
        return badRequestResponse(res, "Failed to saved the data");
      }

      // data send to client without password and otp and otp expired time
      const dataSendToClient = savedData.toObject();
      delete dataSendToClient.password;
      delete dataSendToClient.managementOtp;
      delete dataSendToClient.managementOtpExpiredTime;

      // after otp generate than send the otp to user email
      try {
        await sendSignupVerificationEmail(name, email, otp);
      } catch (error) {
        return internalServerErrorResponse(
          res,
          "Failed to send email",
          error.message
        );
      }

      // send a cookie
      try {
        await sendCookieToUser(savedData._id, res);
      } catch (error) {
        return internalServerErrorResponse(
          res,
          "Failed to send cookie",
          error.message
        );
      }

      // success response
      return successResponse(
        res,
        "A new OTP has been sent to your email address",
        dataSendToClient
      );
    }

    // if a totally fresh user is come than

    // hashed the password
    const hashedPassword = await hashPassword(password);

    // generate the new otp
    const otp = generateOTP();

    // create the otp expired time (5 minutes)
    const otpExpireTime = Date.now() + Number(OTP_EXPIARY_TIME);

    // generate the unique emp id
    const empId = await generateEmpId();

    const newUser = new userModel({
      employeeId: empId,
      name,
      email,
      password: hashedPassword,
      role: "Management",
      phoneNumber,
      managementOtp: otp,
      managementOtpExpiredTime: otpExpireTime,
    });

    // save the new user
    const savedData = await newUser.save();

    if (!savedData) {
      return badRequestResponse(res, "Failed to saved the data");
    }

    // data send to client without password and otp and otp expired time
    const dataSendToClient = savedData.toObject();
    delete dataSendToClient.password;
    delete dataSendToClient.managementOtp;
    delete dataSendToClient.managementOtpExpiredTime;

    // after otp generate than send the otp to user email
    try {
      await sendSignupVerificationEmail(name, email, otp);
    } catch (error) {
      return internalServerErrorResponse(
        res,
        "Failed to send email",
        error.message
      );
    }

    // send a cookie
    try {
      await sendCookieToUser(savedData._id, res);
    } catch (error) {
      return internalServerErrorResponse(
        res,
        "Failed to send cookie",
        error.message
      );
    }

    // success response
    return successResponse(
      res,
      "A new OTP has been sent to your email address",
      dataSendToClient
    );
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// otp checker controller
export const otpController = async (req, res) => {
  try {
    const { otp } = req.body;

    const otpExist = await userModel.findOne({
      managementOtp: otp,
    });

    // const otpExist = await userModel.findOne({
    //   managementOtp: otp,
    //   managementOtpExpiredTime: {$gte: Date.now()}
    // });

    if (!otpExist) {
      return badRequestResponse(res, "Invalid OTP");
    }

    const currentTime = Date.now();

    if (currentTime > otpExist.managementOtpExpiredTime) {
      return badRequestResponse(res, "OTP has been expired");
    }

    otpExist.managementOtp = undefined;
    otpExist.managementOtpExpiredTime = undefined;
    otpExist.isManagementVerified = true;

    const savedData = await otpExist.save();

    if (!savedData) {
      return badRequestResponse(res, "Failed to saved the data");
    }

    const dataSendToClient = savedData.toObject();
    delete dataSendToClient.password;

    // send a success email to the user that user is now verified
    try {
      await sendSignupSuccessEmail(otpExist.name, otpExist.email);
    } catch (error) {
      console.error("Failed to send welcome email:", error.message);
    }

    // send a cookie
    try {
      await sendCookieToUser(savedData._id, res);
    } catch (error) {
      return internalServerErrorResponse(
        res,
        "Failed to send cookie",
        error.message
      );
    }

    return successResponse(res, "OTP verified successfully", dataSendToClient);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// management login
export const managementLoginController = async (req, res) => {
  try {
    const { empId, email, password } = req.body;

    let userExist;

    if (empId) {
      // login with empId
      userExist = await userModel.findOne({
        employeeId: empId,
        isManagementVerified: true,
        role: "Management",
        status: "ACTIVE",
      });
    } else if (email) {
      // login with email
      userExist = await userModel.findOne({
        email,
        isManagementVerified: true,
        role: "Management",
        status: "ACTIVE",
      });
    }

    if (!userExist) {
      return badRequestResponse(res, "Invalid credentials");
    }

    const isValidPassword = await verifyPassword(password, userExist.password);

    if (!isValidPassword) {
      return badRequestResponse(res, "Invalid email or password");
    }

    // update the last login
    userExist.lastLogin = Date.now();

    const savedData = await userExist.save();

    if (!savedData) {
      return badRequestResponse(res, "Failed to saved the data");
    }

    const dataSendToClient = savedData.toObject();
    delete dataSendToClient.password;

    // send a cookie to the user
    try {
      await sendCookieToUser(savedData._id, res);
    } catch (error) {
      return internalServerErrorResponse(
        res,
        "Failed to send cookie",
        error.message
      );
    }

    return successResponse(res, "Login successful", dataSendToClient);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};
// employee and manager login
// logout
// update the password
// reset the password
// forgot password
// update the role by manager and management only
// update the status
// update isAvailable for every user
// update the data
// delete the data
