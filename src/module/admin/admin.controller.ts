import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

// Get All Admin
const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllAdmins();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Admins Get successfully",
    data: result,
  });
});

// Get Specific Admin
const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.params.adminId;

  const result = await adminService.getAdminById(adminId as string);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Admin Get successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const updatedAdmin = await adminService.updateAdmin(id as string, payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admin updated successfully",
    data: updatedAdmin,
  });
});

export const adminController = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
};
