import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { Role, Specialty } from "../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";

// Create Doctor
const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialities = await prisma.specialty.findMany({
    where: {
      id: { in: payload.specialties },
    },
  });

  if (specialities.length !== payload.specialties.length) {
    // throw new Error("One or more specialties not found");
    throw new AppError(status.NOT_FOUND, "One or more specialties not found");
  }

  const existUser = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (existUser) {
    throw new Error("User with this email already exists");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      name: payload.doctor.name,
      needPasswordChange: true,
    },
  });

  try {
    return await prisma.$transaction(
      async (tx) => {
        const doctorData = await prisma.doctor.create({
          data: {
            userId: userData.user.id,
            ...payload.doctor,
          },
        });

        const doctorSpecialityData = specialities.map((specialty) => {
          return {
            doctorId: doctorData.id,
            specialtyId: specialty.id,
          };
        });

        await tx.doctorSpecialty.createMany({
          data: doctorSpecialityData,
        });

        const doctor = await prisma.doctor.findUnique({
          where: { id: doctorData.id },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                emailVerified: true,
                image: true,
                isDeleted: true,
                deletedAt: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            specialties: {
              select: {
                specialty: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        });

        return doctor;
      },
      {
        timeout: 15000,
      },
    );
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

export const userService = {
  createDoctor,
};
