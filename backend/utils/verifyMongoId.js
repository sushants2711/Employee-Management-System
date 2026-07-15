import mongoose from "mongoose";
import { badRequestResponse } from "./response.handler.js";

export const verifyMongoDBId = (id, res) => {
  if (!id) {
    return badRequestResponse(res, `ID is missing`);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return badRequestResponse(res, `Invalid ID`);
  }

  return true;
};
