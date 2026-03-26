import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { authService } from "./auth.service";
import { tokenUtils } from "../../utils/token";

// Create User
const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.createUser(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User Created Successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

// Login User
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.loginUser(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User Login Successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

export const authController = {
  createUser,
  loginUser,
};
