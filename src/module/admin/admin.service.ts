import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateAdminPayload } from "./admin.interface";

// Get All Admins
const getAllAdmins = async () => {
  const allAdmins = await prisma.admin.findMany();

  return allAdmins;
};

// Get Specific Admin
const getAdminById = async (adminId: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    include: { user: true },
  });

  return admin;
};

const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
  //TODO: Validate who is updating the admin user. Only super admin can update admin user and only super admin can update super admin user but admin user cannot update super admin user

  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
  }

  const { admin } = payload;

  const updatedAdmin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      ...admin,
    },
  });

  return updatedAdmin;
};

export const adminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
};
