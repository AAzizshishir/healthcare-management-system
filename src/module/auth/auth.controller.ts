import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { authService } from "./auth.service";

// Create User
const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.createUser(payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User Created Successfully",
    data: result,
  });
});

// Login User
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.loginUser(payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User Login Successfully",
    data: result,
  });
});

export const authController = {
  createUser,
  loginUser,
};
