import express from "express";
import {
  changePasswordMiddleware,
  createAccountMiddleware,
  loginUserByEmailMiddleware,
  loginUserByEmployeeIdMiddleware,
  otpCheckerMiddleware,
  resetPasswordMiddleware,
  updateManagerProfileMiddleware,
  updatePasswordMiddleware,
  updateUserIsAvailableMiddleware,
  updateUserRoleMiddleware,
  updateUserStatusMiddleware,
  userForgotPasswordEmailMiddleware,
  userForgotPasswordEmployeeIdMiddleware,
  userRegistrationForManagerMiddleware,
} from "../middlewares/user.middleware.js";
import {
  allUsersControllers,
  checkManagementCountController,
  countPasswordChangeAfterFirstLoginController,
  createAccountForUserController,
  forgotPasswordController,
  getAllManagersController,
  isAvailableUpdateController,
  logoutController,
  managementLoginController,
  normalUserLoginController,
  otpController,
  resetPasswordController,
  signupManagementController,
  updatePasswordController,
  updatePasswordFirstTimeController,
  updateProfileManagerController,
  getLoggedInUserDetailsController,
  updateTheProfileImageController,
  updateTheRoleController,
  updateTheStatusController,
} from "../controllers/user.controller.js";
import { verifyCookie } from "../utils/verify.cookie.js";
import { verifyManagement } from "../utils/verify.management.js";
import { verifyManagerOrManagement } from "../utils/verify.managerOrManagement.js";
import { verifyEmployeeOrManager } from "../utils/verify.employeeOrManager.js";
import { uploadEmployeeImage } from "../config/multer.js";

const userRouter = express.Router();

// normal user login controller by email
userRouter
  .route("/login-email")
  .post(loginUserByEmailMiddleware, normalUserLoginController);

// normal user login controller by emp id
userRouter
  .route("/login-empid")
  .post(loginUserByEmployeeIdMiddleware, normalUserLoginController);

// logout controller
userRouter.route("/logout").post(verifyCookie, logoutController);

// count the change password after normal user login like manager or employee
userRouter
  .route("/check-password-count")
  .get(
    verifyCookie,
    verifyEmployeeOrManager,
    countPasswordChangeAfterFirstLoginController
  );

// update the password first time
userRouter
  .route("/login-password-change")
  .put(
    verifyCookie,
    verifyEmployeeOrManager,
    changePasswordMiddleware,
    updatePasswordFirstTimeController
  );

// update password
userRouter
  .route("/change-password")
  .put(verifyCookie, updatePasswordMiddleware, updatePasswordController);

// forgot password with email
userRouter
  .route("/forgot-password-email")
  .post(userForgotPasswordEmailMiddleware, forgotPasswordController);

// forgot password with emp id
userRouter
  .route("/forgot-password-empid")
  .post(userForgotPasswordEmployeeIdMiddleware, forgotPasswordController);

// reset password
userRouter
  .route("/reset-password")
  .put(resetPasswordMiddleware, resetPasswordController);

// is available for every user
userRouter
  .route("/is-available")
  .put(
    verifyCookie,
    updateUserIsAvailableMiddleware,
    isAvailableUpdateController
  );

// get single user details for user
userRouter
  .route("/single-user")
  .get(verifyCookie, getLoggedInUserDetailsController);

// update the profile image controller for every user
userRouter
  .route("/update-profile-image")
  .put(
    verifyCookie,
    uploadEmployeeImage.single("image"),
    updateTheProfileImageController
  );

// for management only specific routes

// update the role
userRouter
  .route("/update-role")
  .put(
    verifyCookie,
    verifyManagement,
    updateUserRoleMiddleware,
    updateTheRoleController
  );

// update the status
userRouter
  .route("/update-status")
  .put(
    verifyCookie,
    verifyManagement,
    updateUserStatusMiddleware,
    updateTheStatusController
  );

// all the company user details
userRouter.route("/all-users").get(verifyCookie, allUsersControllers);

// management singup
userRouter
  .route("/manager-signup")
  .post(userRegistrationForManagerMiddleware, signupManagementController);

// management count
userRouter.route("/manager-count").get(checkManagementCountController);

// otp verification
userRouter.route("/otp").post(otpCheckerMiddleware, otpController);

// management login via email
userRouter
  .route("/management-email-login")
  .post(loginUserByEmailMiddleware, managementLoginController);

// management login via emp id
userRouter
  .route("/management-empid-login")
  .post(loginUserByEmployeeIdMiddleware, managementLoginController);

// create a account for employee and manager
userRouter
  .route("/create-account")
  .post(
    verifyCookie,
    verifyManagerOrManagement,
    createAccountMiddleware,
    createAccountForUserController
  );

// get all manager and team leader and department
userRouter
  .route("/all-managers")
  .get(verifyCookie, verifyEmployeeOrManager, getAllManagersController);

// get update the profile
userRouter
  .route("/update-profile-manager")
  .put(
    verifyCookie,
    verifyManagerOrManagement,
    updateManagerProfileMiddleware,
    updateProfileManagerController
  );

export default userRouter;
