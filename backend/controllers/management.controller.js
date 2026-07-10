import managementModel from "../models/management.model.js";
import { verifyPassword } from "../utils/comparePassword.js";
import { hashPassword } from "../utils/hashedPassword.js";
import {
    internalServerErrorResponse,
    createdResponse,
    badRequestResponse,
    successResponse,
    notFoundResponse,
} from "../utils/response.handler.js";
import { sendCookieToUser } from "../utils/send.cookie.js";