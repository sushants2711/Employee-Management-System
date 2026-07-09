import joi from "joi";
import { badRequestResponse, internalServerErrorResponse, validationErrorResponse } from "../utils/response.handler";

export const userRegistrationMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            employeeId: joi.string().min(6).max(6).required(),
            name: joi.string().min(3).max(50).required(),
            email: joi.string().email().min(10).max(50).required(),
            password: joi.string().min(8).max(100).required(),
            confirmPassword: joi.string().min(8).max(100).required(),
            role: joi.string().valid("Employee", "Manager", "Team Leader", "Management").required(),
            phoneNumber: joi.string().min(13).max(13).required(),
            designation: joi.string().required(),
            department: joi.string().required(),
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