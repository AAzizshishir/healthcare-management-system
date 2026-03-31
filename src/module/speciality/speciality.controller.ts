import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { specialityService } from "./speciality.service";
import { sendResponse } from "../../utils/sendResponse";

// Create Speciality
const addSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    icon: req.file?.path,
  };
  const result = await specialityService.createSpeciality(payload);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Speciality create successfully",
    data: result,
  });
});

// Get Specilities
const getSpecialities = catchAsync(async (req: Request, res: Response) => {
  const specialities = await specialityService.getSpecialities();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialities Get successfully",
    data: specialities,
  });
});

// Edit Speciality
const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const specialityId = req.params.specialityId;
  if (!specialityId) {
    throw Error("Id is required");
  }
  const result = await specialityService.updateSpeciality(
    specialityId as string,
    payload,
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Speciality Updated successfully",
    data: result,
  });
});

// Delete Speciality
const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
  const specialityId = req.params.specialityId;
  if (!specialityId) {
    throw Error("Id is required");
  }
  const result = await specialityService.deleteSpeciality(
    specialityId as string,
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Speciality Deleted successfully",
    data: result,
  });
});

export const specialityController = {
  addSpeciality,
  getSpecialities,
  updateSpeciality,
  deleteSpeciality,
};
