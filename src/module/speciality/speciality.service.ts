import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { Specialty } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// Create Speciality
const createSpeciality = async (payload: Specialty): Promise<Specialty> => {
  const findSpeciality = await prisma.specialty.findUnique({
    where: {
      title: payload.title,
    },
  });
  if (findSpeciality) {
    throw new AppError(status.CONFLICT, "Speciality already exist");
  }
  const speciality = await prisma.specialty.create({
    data: payload,
  });

  return speciality;
};

// Get Specialities
const getSpecialities = async (): Promise<Specialty[]> => {
  const specialities = await prisma.specialty.findMany();

  return specialities;
};

// Edit Speciality
const updateSpeciality = async (
  id: string,
  payload: Specialty,
): Promise<Specialty> => {
  const result = await prisma.specialty.update({
    where: { id },
    data: payload,
  });

  return result;
};

// Delete Speciality
const deleteSpeciality = async (id: string): Promise<Specialty> => {
  const speciality = await prisma.specialty.delete({
    where: {
      id,
    },
  });

  return speciality;
};

export const specialityService = {
  createSpeciality,
  getSpecialities,
  updateSpeciality,
  deleteSpeciality,
};
