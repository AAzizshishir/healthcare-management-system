import { Specialty } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// Create Speciality
const createSpeciality = async (payload: Specialty): Promise<Specialty> => {
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
