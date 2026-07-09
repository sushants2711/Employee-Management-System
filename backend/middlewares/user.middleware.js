import joi from "joi";
import { badRequestResponse, internalServerErrorResponse, validationErrorResponse } from "../utils/response.handler";

export const userRegistrationMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            employeeId: joi.string().min(6).max(6).trim().required(),
            name: joi.string().min(3).max(50).trim().required(),
            email: joi.string().email().min(10).max(50).trim().required(),
            password: joi.string().min(8).max(100).required(),
            confirmPassword: joi.string().min(8).max(100).required(),
            role: joi.string().valid("Employee", "Manager", "Team Leader", "Management").required(),
            phoneNumber: joi.string().min(13).max(13).trim().required(),
            designation: joi.string().trim().required(),
            department: joi.string().trim().required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return validationErrorResponse(res, "Error Occured at User Registration Validation", error.message);
        };

        if (req.body.password !== req.body.confirmPassword) {
            return badRequestResponse(res, "Password and Confirm Password do not match");
        };

        next();

    } catch (error) {
        return internalServerErrorResponse(res, "Internal Server Error", error.message);
    };
};

export const loginUserMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            email: joi.string().email().min(10).max(50).trim().required(),
            password: joi.string().min(8).max(100).required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return validationErrorResponse(res, "Error Occured at Login Validation", error.message);
        };

        next();

    } catch (error) {
        return internalServerErrorResponse(res, "Internal Server Error", error.message);
    };
};

export const userForgotPasswordMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            email: joi.string().email().min(10).max(50).trim().required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return validationErrorResponse(res, "Error Occured at Forgot Password Validation", error.message);
        };

        next();

    } catch (error) {
        return internalServerErrorResponse(res, "Internal Server Error", error.message);
    };
};

export const resetPasswordMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            otp: joi.string().min(6).max(6).trim().required(),
            password: joi.string().min(8).max(100).required(),
            confirmPassword: joi.string().min(8).max(100).required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return validationErrorResponse(res, "Error Occured at Reset Password Validation", error.message);
        };

        if (req.body.password !== req.body.confirmPassword) {
            return badRequestResponse(res, "Password and Confirm Password do not match");
        };

        next();

    } catch (error) {
        return internalServerErrorResponse(res, "Internal Server Error", error.message);
    };
};

export const updatePasswordMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            oldPassword: joi.string().min(8).max(100).required(),
            newPassword: joi.string().min(8).max(100).required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return validationErrorResponse(res, "Error Occured at Update Password Validation", error.message);
        };

        if (req.body.newPassword !== req.body.confirmPassword) {
            return badRequestResponse(res, "New Password and Confirm Password do not match");
        };

        next();

    } catch (error) {
        return internalServerErrorResponse(res, "Internal Server Error", error.message);
    };
};

// update the role
// update the status
// update the isAvailable
// update the designation
// update the department
// update the teamName
// update the phoneNumber
// update the userType