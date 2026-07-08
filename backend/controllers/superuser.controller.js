// import superuserModel from "../models/superuser.model.js";
// import bcrypt from "bcryptjs";
// import { internalServerErrorResponse, forbiddenResponse, validationErrorResponse, successResponse, badRequestResponse } from "../utils/response.handler.js";


// export const createSuperUserController = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         const countSuperUser = await superuserModel.countDocuments({});

//         if (countSuperUser > 2) {
//             return forbiddenResponse(res, "Superuser limit exceeded");
//         };

//         const existSuperUser = await superuserModel.findOne({ email });

//         if (existSuperUser) {
//             return badRequestResponse(res, "User already exist");
//         };


//     } catch (error) {
//         return internalServerErrorResponse(res, "Internal Server Error", error.message);
//     };
// };