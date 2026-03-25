import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { doctorService } from "./doctor.service";
import status from "http-status";

const getDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorService.getDoctors();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctors Get Successfully",
    data: result,
  });
});

// get doctor by id
const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const doctorId = req.params.doctorId;
  const result = await doctorService.getDoctorById(doctorId as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor Get Successfully",
    data: result,
  });
});

const updateDoctorData = catchAsync(async (req: Request, res: Response) => {
  const doctorId = req.params.doctorId;
  const payload = req.body;
  const result = await doctorService.updateDoctorData(
    payload,
    doctorId as string,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor Update Successfully",
    data: result,
  });
});

// delete doctor
const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctorId = req.params.doctorId;
  const result = await doctorService.deleteDoctor(doctorId as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor Deleted Successfully",
    data: result,
  });
});

export const doctorController = {
  getDoctors,
  getDoctorById,
  updateDoctorData,
  deleteDoctor,
};
