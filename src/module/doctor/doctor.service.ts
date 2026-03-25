import { Doctor } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// get all doctor
const getDoctors = async () => {
  const activeDoctors = await prisma.doctor.findMany({
    where: { isDeleted: false },
    include: {
      user: true,
      specialties: true,
    },
  });

  return activeDoctors;
};

// get doctor by id
const getDoctorById = async (doctorId: string) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  if (!result) {
    throw new Error("Not Find doctor");
  }

  return result;
};

// update doctor data
const updateDoctorData = async (
  payload: Doctor,
  doctorId: string,
): Promise<Doctor> => {
  const result = await prisma.doctor.update({
    where: { id: doctorId },
    data: payload,
  });

  return result;
};

// delete doctor
const deleteDoctor = async (doctorId: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId, isDeleted: false },
  });

  if (!doctor) {
    throw new Error("Doctor not found or Deleted");
  }

  const result = await prisma.doctor.update({
    where: { id: doctorId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return result;
};

export const doctorService = {
  getDoctors,
  getDoctorById,
  updateDoctorData,
  deleteDoctor,
};
