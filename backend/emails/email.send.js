import { transporter } from "../config/nodemailer.config.js";
import { SMTP_NAME, SMTP_USER } from "../config/constant.js";
import {
  getSignupVerificationEmailTemplate,
  getSignupSuccessEmailTemplate,
  getForgotPasswordEmailTemplate,
  getPasswordResetSuccessEmailTemplate,
  getAccountDeletionRequestEmailTemplate,
  getAccountDeletionSuccessEmailTemplate,
} from "../emails/email.template.js";

export const sendSignupVerificationEmail = async (name, email, otp) => {
  if (!name) throw new Error("Name is missing");
  if (!email) throw new Error("Email Id is missing");
  if (!otp) throw new Error("OTP is missing");

  try {
    const info = await transporter.sendMail({
      from: `"${SMTP_NAME}" <${SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: getSignupVerificationEmailTemplate(name, email, otp),
    });

    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const sendSignupSuccessEmail = async (name, email) => {
  if (!name) throw new Error("Name is missing");
  if (!email) throw new Error("Email Id is missing");

  try {
    const info = await transporter.sendMail({
      from: `"${SMTP_NAME}" <${SMTP_USER}>`,
      to: email,
      subject: "Registration Successful",
      html: getSignupSuccessEmailTemplate(name, email),
    });

    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getForgotPasswordEmail = async (name, email, otp) => {
  if (!name) throw new Error("Name is missing");
  if (!email) throw new Error("Email Id is missing");
  if (!otp) throw new Error("OTP is missing");

  try {
    const info = await transporter.sendMail({
      from: `"${SMTP_NAME}" <${SMTP_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: getForgotPasswordEmailTemplate(name, email, otp),
    });

    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const sendPasswordResetSuccessEmail = async (name, email) => {
  if (!name) throw new Error("Name is missing");
  if (!email) throw new Error("Email Id is missing");

  try {
    const info = await transporter.sendMail({
      from: `"${SMTP_NAME}" <${SMTP_USER}>`,
      to: email,
      subject: "Password Reset Successful",
      html: getPasswordResetSuccessEmailTemplate(name, email),
    });

    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAccountDeletionRequestEmail = async (name, email, otp) => {
  if (!name) throw new Error("Name is missing");
  if (!email) throw new Error("Email Id is missing");
  if (!otp) throw new Error("OTP is missing");

  try {
    const info = await transporter.sendMail({
      from: `"${SMTP_NAME}" <${SMTP_USER}>`,
      to: email,
      subject: "Account Deletion Request",
      html: getAccountDeletionRequestEmailTemplate(name, email, otp),
    });

    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAccountDeletionSuccessEmail = async (name, email) => {
  if (!name) throw new Error("Name is missing");
  if (!email) throw new Error("Email Id is missing");

  try {
    const info = await transporter.sendMail({
      from: `"${SMTP_NAME}" <${SMTP_USER}>`,
      to: email,
      subject: "Account Deletion Success",
      html: getAccountDeletionSuccessEmailTemplate(name, email),
    });

    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};
