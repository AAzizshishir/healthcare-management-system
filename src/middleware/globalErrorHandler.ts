import { NextFunction, Request, Response } from "express";
import { envVariables } from "../config/env";
import status from "http-status";
import { deleteFileFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVariables.NODE_ENV === "development") {
    console.log("Error from glabal error handler", err);
  }

  if (req.file) {
    await deleteFileFromCloudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map((file) => file.path);
    await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url)));
  }

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.message,
  });
};
