import {
  getForgotPasswordEmail,
  sendSignupSuccessEmail,
  sendSignupVerificationEmail,
  sendPasswordResetSuccessEmail,
} from "../emails/email.send.js";
import userModel from "../models/user.model.js";
import { verifyPassword } from "../utils/comparePassword.js";
import { generateEmpId } from "../utils/generateEmpId.js";
import { hashPassword } from "../utils/hashedPassword.js";
import { generateOTP } from "../utils/otp.generator.js";
import {
  badRequestResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/response.handler.js";
import { OTP_EXPIARY_TIME, COOKIE_NAME } from "../config/constant.js";
import { sendCookieToUser } from "../utils/send.cookie.js";
import { cookieOptionsSetting } from "../utils/cookieOptions.js";
import { verifyMongoDBId } from "../utils/verifyMongoId.js";
import cloudinary from "../config/cloudinary.config.js";

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
      return badRequestResponse(res, "Invalid password");
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
export const normalUserLoginController = async (req, res) => {
  try {
    const { empId, email, password } = req.body;

    let userExist;

    if (empId) {
      // login with empId
      userExist = await userModel.findOne({
        employeeId: empId,
        status: "ACTIVE",
        role: { $in: ["Employee", "Manager", "Team Leader"] },
      });
    } else if (email) {
      // login with email
      userExist = await userModel.findOne({
        email,
        status: "ACTIVE",
        role: { $in: ["Employee", "Manager", "Team Leader"] },
      });
    }

    if (!userExist) {
      return badRequestResponse(res, "Invalid credentials");
    }

    const isValidPassword = await verifyPassword(password, userExist.password);

    if (!isValidPassword) {
      return badRequestResponse(res, "Invalid password");
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

// logout controller
export const logoutController = async (req, res) => {
  try {
    // clear both potential cookies
    res.clearCookie(COOKIE_NAME, cookieOptionsSetting);

    // send a response
    return successResponse(res, "Logout successfully");
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// this api endpoints is basically check the normal user login after change their password or not if the password is change than this api is not works else first force the frontend to show that page where user change the password
export const countPasswordChangeAfterFirstLoginController = async (
  req,
  res
) => {
  try {
    const loggedInUser = req.user._id;

    const result = verifyMongoDBId(loggedInUser, res);

    if (!result) {
      return result;
    }

    const userExist = await userModel
      .findById(loggedInUser)
      .select("-password");

    if (!userExist) {
      return badRequestResponse(res, "User not found");
    }

    if (userExist.role === "Management") {
      return badRequestResponse(res, "Management user cannot access this API");
    }

    if (userExist.isChangedPasswordCount === 0) {
      return badRequestResponse(res, "Please change your password first");
    }

    return successResponse(res, "Password already changed", userExist);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the password for the first time
export const updatePasswordFirstTimeController = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const { oldPassword, newPassword } = req.body;

    const result = verifyMongoDBId(loggedInUserId, res);

    if (!result) {
      return result;
    }

    const userExist = await userModel.findById(loggedInUserId);

    if (!userExist) {
      return badRequestResponse(res, "User not found");
    }

    if (userExist.role === "Management") {
      return badRequestResponse(res, "Management user cannot access this API");
    }

    if (userExist.isChangedPasswordCount >= 1) {
      return badRequestResponse(res, "Password has already been updated once");
    }

    // check the old password
    const checkPassword = await verifyPassword(oldPassword, userExist.password);

    if (!checkPassword) {
      return badRequestResponse(res, "Invalid old password");
    }

    // hash the new password
    const hashedPassword = await hashPassword(newPassword);

    userExist.password = hashedPassword;
    userExist.isChangedPasswordCount = userExist.isChangedPasswordCount + 1;

    const updatedUser = await userExist.save();

    if (!updatedUser) {
      return badRequestResponse(res, "Failed to update password");
    }

    const dataSendToClient = updatedUser.toObject();
    delete dataSendToClient.password;

    return successResponse(
      res,
      "Password updated successfully",
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

// update the password
export const updatePasswordController = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const { oldPassword, newPassword } = req.body;

    const result = verifyMongoDBId(loggedInUserId, res);

    if (!result) {
      return result;
    }

    const userExist = await userModel.findById(loggedInUserId);

    if (!userExist) {
      return badRequestResponse(res, "User not found");
    }

    // check the old password
    const checkPassword = await verifyPassword(oldPassword, userExist.password);

    if (!checkPassword) {
      return badRequestResponse(res, "Invalid credentials");
    }

    // hash the new password
    const hashedPassword = await hashPassword(newPassword);

    userExist.password = hashedPassword;
    userExist.isChangedPasswordCount = userExist.isChangedPasswordCount + 1;

    const updatedUser = await userExist.save();

    if (!updatedUser) {
      return badRequestResponse(res, "Failed to update password");
    }

    const dataSendToClient = updatedUser.toObject();
    delete dataSendToClient.password;

    return successResponse(
      res,
      "Password updated successfully",
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

// forgot the password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, empId } = req.body;

    let userExist;

    if (empId) {
      userExist = await userModel.findOne({ employeeId: empId });
    } else if (email) {
      userExist = await userModel.findOne({ email });
    }

    if (!userExist) {
      return badRequestResponse(res, "User not found");
    }

    if (userExist.role === "Management" && !userExist.isManagementVerified) {
      return badRequestResponse(res, "Verified your account first");
    }

    if (userExist.status !== "ACTIVE") {
      return badRequestResponse(res, "User is not Active");
    }

    const otp = generateOTP();

    userExist.forgotPasswordToken = otp;
    userExist.forgotPasswordExpireTime = Date.now() + Number(OTP_EXPIARY_TIME);

    const savedData = await userExist.save();

    if (!savedData) {
      return badRequestResponse(res, "Failed to generate OTP");
    }

    // send a email to the user
    try {
      await getForgotPasswordEmail(userExist.name, userExist.email, otp);
    } catch (error) {
      return internalServerErrorResponse(
        res,
        "Failed to send an email",
        error.message
      );
    }

    const dataSendToClient = savedData.toObject();
    delete dataSendToClient.password;
    delete dataSendToClient.forgotPasswordToken;
    delete dataSendToClient.forgotPasswordExpireTime;

    return successResponse(res, "OTP generated successfully", dataSendToClient);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// reset password
export const resetPasswordController = async (req, res) => {
  try {
    const { otp, password } = req.body;

    // check otp exist or not
    const otpExist = await userModel.findOne({ forgotPasswordToken: otp });

    // if otp not exist
    if (!otpExist) {
      return badRequestResponse(res, "Invalid OTP");
    }

    // get the current time
    const currentTime = Date.now();

    // check the current time is bigger than store time than return error
    if (currentTime > otpExist.forgotPasswordExpireTime) {
      return badRequestResponse(res, "OTP is expired");
    }

    // hash the password
    const hashedPassword = await hashPassword(password);

    otpExist.password = hashedPassword;
    otpExist.forgotPasswordToken = undefined;
    otpExist.forgotPasswordExpireTime = undefined;

    const savedData = await otpExist.save();

    if (!savedData) {
      return badRequestResponse(res, "Failed to reset password");
    }

    // send a email to the user
    try {
      await sendPasswordResetSuccessEmail(otpExist.name, otpExist.email);
    } catch (error) {
      return internalServerErrorResponse(
        res,
        "Failed to send an email",
        error.message
      );
    }

    const dataSendToClient = savedData.toObject();
    delete dataSendToClient.password;

    return successResponse(
      res,
      "Password reset successfully",
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

// update the role by management only
export const updateTheRoleController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { role } = req.body;

    const { id } = req.params;

    const checkId = verifyMongoDBId(id, res);

    if (!checkId) {
      return checkId;
    }

    const result = verifyMongoDBId(loggedInUser._id, res);

    if (!result) {
      return result;
    }

    if (loggedInUser.status !== "ACTIVE") {
      return badRequestResponse(res, "Your account is not active");
    }

    if (loggedInUser.role !== "Management") {
      return badRequestResponse(
        res,
        "You are not authorized to perform this action"
      );
    }

    const userExist = await userModel.findById(id);

    if (!userExist) {
      return badRequestResponse(res, "User not found");
    }

    userExist.role = role;
    userExist.updateByRole = loggedInUser._id;

    const savedData = await userExist.save();

    const dataSendToClient = savedData.toObject();
    delete dataSendToClient.password;
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// update the status by manager and management only
export const updateTheStatusController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { status } = req.body;

    const { id } = req.params;

    // check the id is valid
    const checkId = verifyMongoDBId(id, res);

    if (!checkId) {
      return checkId;
    }

    const result = verifyMongoDBId(loggedInUser._id, res);

    if (!result) {
      return result;
    }

    if (loggedInUser.status !== "ACTIVE") {
      return badRequestResponse(res, "Your account is not active");
    }

    if (loggedInUser.role !== "Management") {
      return badRequestResponse(
        res,
        "You are not authorized to perform this action"
      );
    }

    const userExist = await userModel.findById(id);

    if (!userExist) {
      return badRequestResponse(res, "User not found");
    }

    userExist.status = status;
    userExist.updateByStatus = loggedInUser._id;

    const savedData = await userExist.save();

    const dataSendToClient = savedData.toObject();
    delete dataSendToClient.password;

    return successResponse(
      res,
      "Status updated successfully",
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

// update isAvailable for every user
export const isAvailableUpdateController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { isAvailable } = req.body;

    const result = verifyMongoDBId(loggedInUser._id, res);

    if (!result) {
      return result;
    }

    const userExist = await userModel.findById(loggedInUser._id);

    if (!userExist) {
      return badRequestResponse(res, "User not found");
    }

    if (userExist._id.toString() !== loggedInUser._id.toString()) {
      return badRequestResponse(
        res,
        "You are not authorized to perform this action"
      );
    }

    if (userExist.status !== "ACTIVE") {
      return badRequestResponse(res, "Your account is not active");
    }

    userExist.isAvailable = isAvailable;

    const savedData = await userExist.save();

    const dataSendToClient = savedData.toObject();
    delete dataSendToClient.password;

    return successResponse(
      res,
      "Status updated successfully",
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

// update the profile Image
export const updateTheProfileImageController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const image = req.file;

    if (!image) {
      return badRequestResponse(res, "Please upload an image");
    }

    const result = verifyMongoDBId(loggedInUser._id, res);

    if (result !== true) {
      if (image && image.filename) {
        await cloudinary.uploader.destroy(image.filename);
      }
      return result;
    }

    const userExist = await userModel.findById(loggedInUser._id);

    if (!userExist) {
      if (image && image.filename) {
        await cloudinary.uploader.destroy(image.filename);
      }
      return badRequestResponse(res, "User not found");
    }

    if (userExist._id.toString() !== loggedInUser._id.toString()) {
      if (image && image.filename) {
        await cloudinary.uploader.destroy(image.filename);
      }
      return badRequestResponse(
        res,
        "You are not authorized to perform this action"
      );
    }

    if (userExist.profilePicId) {
      try {
        await cloudinary.uploader.destroy(userExist.profilePicId);
      } catch (error) {
        console.error(
          "Failed to delete old image from cloudinary:",
          error.message
        );
      }
    }

    userExist.profilePicUrl = image.path;
    userExist.profilePicId = image.filename;

    const savedData = await userExist.save();

    const dataSendToClient = savedData.toObject();
    delete dataSendToClient.password;

    return successResponse(
      res,
      "Profile image updated successfully",
      dataSendToClient
    );
  } catch (error) {
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// all users in the company
export const allUsersControllers = async (req, res) => {
  try {
    const {
      role,
      status,
      name,
      employeeId,
      teamName,
      designation,
      department,
    } = req.query;

    let query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (name) query.name = name;
    if (employeeId) query.employeeId = employeeId;
    if (teamName) query.teamName = teamName;
    if (designation) query.designation = designation;
    if (department) query.department = department;

    const allData = await userModel
      .find(query)
      .populate("teamName", "teamName")
      .populate("designation", "designationName")
      .populate("department", "departmentName");

    if (!allData || allData.length === 0 || !Array.isArray(allData)) {
      return notFoundResponse(res, "No data found");
    }

    return successResponse(res, "Data fetched successfully", allData);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// get single user details for user itself
export const singleUserDetailsController = async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const checkId = verifyMongoDBId(loggedInUser, res);

    if (!checkId) {
      return checkId;
    }

    const singleUserData = await userModel
      .findById(loggedInUser)
      .populate("teamName", "teamName teamLead manager")
      .populate("designation", "designationName designationCode")
      .populate("department", "departmentName departmentCode status")
      .select("-password");

    if (!singleUserData) {
      return notFoundResponse(res, "User not found");
    }

    if (loggedInUser.toString() !== singleUserData._id.toString()) {
      return badRequestResponse(
        res,
        "You are not authorized to perform this action"
      );
    }

    return successResponse(res, "Data fetched successfully", singleUserData);
  } catch (error) {
    return internalServerErrorResponse(
      res,
      "Internal Server Error",
      error.message
    );
  }
};

// account create for employee and manager by management and manager only
export const createAccountForUserController = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const id = loggedInUser._id;

    const {
      name,
      email,
      password,
      role,
      phoneNumber,
      teamName,
      designation,
      department,
    } = req.body;

    const checkId = verifyMongoDBId(id, res);

    if (!checkId) {
      return checkId;
    }

    const userExist = await userModel.findById(id);

    if (!userExist) {
      return notFoundResponse(res, "User not found");
    }

    if (loggedInUser.role !== "Management" || loggedInUser.role !== "Manager") {
      return badRequestResponse(
        res,
        "You are not authorized to perform this action"
      );
    }

    const emailOrPhoneNumberExist = await userModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (emailOrPhoneNumberExist) {
      return badRequestResponse(res, "Email or Phone number already exist");
    }

    const hashedPassword = await hashPassword(password);

    const empId = generateEmpId();

    const newUserAccount = new userModel({
      employeeId: empId,
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      teamName,
      designation,
      department,
      createdAccount: id,
    });

    const savedData = await newUserAccount.save();

    const dataSendToClient = savedData.toObject();
    delete dataSendToClient.password;

    return successResponse(
      res,
      `${role.toLowerCase()} account created successfully`,
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
