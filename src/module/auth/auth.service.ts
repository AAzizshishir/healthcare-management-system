import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IUserData {
  name: string;
  email: string;
  password: string;
}

// Create User
const createUser = async (payload: IUserData) => {
  const { name, email, password } = payload;
  console.log(payload, "from service");
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!result.user) {
    throw new Error("Failed to register patient");
  }

  const patient = await prisma.$transaction(async (tx) => {
    return await tx.patient.create({
      data: {
        id: result.user.id,
        name: payload.name,
        email: payload.email,
        user: {
          connect: { id: result.user.id },
        },
      },
    });
  });

  return {
    ...result,
    patient,
  };
};

interface IloginUser {
  email: string;
  password: string;
}

// Login User
const loginUser = async (payload: IloginUser) => {
  const { email, password } = payload;
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  return result;
};

export const userService = {
  createUser,
  loginUser,
};
