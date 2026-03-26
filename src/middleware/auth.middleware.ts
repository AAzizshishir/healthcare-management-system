import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { envVariables } from "../config/env";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        status: UserStatus;
        emailVerified: boolean;
      };
    }
  }
}

export const authMiddleware = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. get refresh token
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized! No session token provided.",
        );
      }

      // 2. validate session in the db
      const session = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (!session || !session.user) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized! Invalid or expired session.",
        );
      }

      const user = session.user;

      // 3. Session expiry warning headers
      const nowDate = new Date();
      const expiresAt = new Date(session.expiresAt);
      const sessionLifeTime =
        expiresAt.getTime() - new Date(session.createdAt).getTime();
      const remainingTime = expiresAt.getTime() - nowDate.getTime();
      const remainingPercent = (remainingTime / sessionLifeTime) * 100;

      if (remainingPercent < 20) {
        res.setHeader("X-Session-Refresh", "true");
        res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
        res.setHeader("X-Time-Remaining", remainingTime.toString());
      }

      //   4. Check User status
      if (
        user.status === UserStatus.BLOCKED ||
        user.status === UserStatus.DELETED ||
        user.isDeleted
      ) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized! User is not active.",
        );
      }

      //  5. check roles
      if (roles.length > 0 && !roles.includes(user.role)) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden! You do not have permission.",
        );
      }

      // Attach user info to request
      req.user = {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        status: user.status,
      };

      // 6. Access token verification
      const accessToken = cookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized! No access token provided.",
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVariables.ACCESS_TOKEN_SECRET,
      );
      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized! Invalid access token.",
        );
      }

      // 7. Role check (from access token payload)
      if (
        roles.length > 0 &&
        !roles.includes(verifiedToken.data!.role as Role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden! You do not have permission.",
        );
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};
