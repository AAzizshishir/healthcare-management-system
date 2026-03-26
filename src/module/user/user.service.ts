import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import {
  Admin,
  Doctor,
  Role,
  Specialty,
  UserStatus,
} from "../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import {
  ICreateAdminPayload,
  ICreateDoctorPayload,
  ILoginDoctor,
} from "./user.interface";
import { tokenUtils } from "../../utils/token";

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
    // 4. Transaction: create doctor + specialties
    const doctor = await prisma.$transaction(async (tx) => {
      return await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
          specialties: {
            create: payload.specialties.map((id) => ({
              specialtyId: id,
            })),
          },
        },
        include: {
          user: true,
          specialties: { include: { specialty: true } },
        },
      });
    });

    // 5. Generate tokens
    const accessToken = tokenUtils.getAccessToken({
      userId: userData.user.id,
      role: Role.DOCTOR,
      name: payload.doctor.name,
      email: payload.doctor.email,
      status: userData.user.status,
      isDeleted: userData.user.isDeleted,
      emailVerified: userData.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userId: userData.user.id,
      role: Role.DOCTOR,
      name: payload.doctor.name,
      email: payload.doctor.email,
      status: userData.user.status,
      isDeleted: userData.user.isDeleted,
      emailVerified: userData.user.emailVerified,
    });

    // 6. Return doctor + tokens
    return { ...userData, accessToken, refreshToken, doctor };
  } catch (error) {
    // Rollback user if doctor creation fails
    await prisma.user.delete({ where: { id: userData.user.id } });
    throw error;
  }
};

// Create Admin
const createAdmin = async (payload: ICreateAdminPayload) => {
  // 1. Check if user already exists
  const existUser = await prisma.user.findUnique({
    where: { email: payload.admin.email },
  });
  if (existUser) {
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  // 2. Create user in Better Auth
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: Role.ADMIN,
      name: payload.admin.name,
      needPasswordChange: true,
    },
  });

  try {
    // 3. Transaction: create admin linked to user
    const admin = await prisma.$transaction(async (tx) => {
      return await tx.admin.create({
        data: {
          userId: userData.user.id,
          ...payload.admin,
        },
      });
    });

    // 4. Generate tokens
    const accessToken = tokenUtils.getAccessToken({
      userId: userData.user.id,
      role: Role.ADMIN,
      name: payload.admin.name,
      email: payload.admin.email,
      status: userData.user.status,
      isDeleted: userData.user.isDeleted,
      emailVerified: userData.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userId: userData.user.id,
      role: Role.ADMIN,
      name: payload.admin.name,
      email: payload.admin.email,
      status: userData.user.status,
      isDeleted: userData.user.isDeleted,
      emailVerified: userData.user.emailVerified,
    });

    // 5. Return admin + tokens
    return { ...userData, accessToken, refreshToken, admin };
  } catch (error) {
    // Rollback user if admin creation fails
    await prisma.user.delete({ where: { id: userData.user.id } });
    throw error;
  }
};

export const userService = {
  createDoctor,
  createAdmin,
};
