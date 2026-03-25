import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";
import { Request, Response } from "express";

// Create Doctor
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createDoctor(payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Doctor Created Successfully",
    data: result,
  });
});

export const userController = {
  createDoctor,
};
