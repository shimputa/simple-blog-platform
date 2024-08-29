import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { registerSchema, loginSchema ,passwordResetRequestSchema, passwordResetSchema} from '../../schemas/auth validation/auth.schema';
import { sendOTP } from '../../utils/opt'; 

const prisma = new PrismaClient();

// Register a new user
export const registerUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const parsedData = registerSchema.parse(req.body);
        const { email, password, name } = parsedData;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return reply.code(409).send({
                statusCode: 409,
                error: 'Conflict',
                message: 'User with this email already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        return reply.code(201).send(user);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.code(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: 'Invalid input data',
                details: error.errors,
            });
        } else {
            return reply.code(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: 'Failed to register user due to server error',
            });
        }
    }
};

export const loginUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const parsedData = loginSchema.parse(req.body);
    const { email, password } = parsedData;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    // Record login activity
    await prisma.loginActivity.create({
      data: {
        userId: user.id,
        loginTime: new Date(),
      },
    });

    // Create a JWT token using reply.jwtSign
    const token = await reply.jwtSign({ userId: user.id });

    return reply.send({
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid input data',
        details: error.errors,
      });
    } else {
      console.error('Login error:', error);
      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to log in due to server error',
      });
    }
  }
};


export const requestPasswordReset = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email } = passwordResetRequestSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'User with this email does not exist',
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        passwordResetOTP: await bcrypt.hash(otp, 10),
        passwordResetExpires: otpExpires,
      },
    });

    // Send OTP via email
    await sendOTP(user.email, otp);

    return reply.code(200).send({
      statusCode: 200,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid input data',
        details: error.errors,
      });
    } else {
      console.error('Password reset request error:', error);
      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to process password reset request',
      });
    }
  }
};


  export const verifyOTPAndResetPassword = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, otp, newPassword } = passwordResetSchema.parse(req.body);
  
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user || !user.passwordResetOTP || !user.passwordResetExpires) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid or expired password reset request',
        });
      }
  
      if (user.passwordResetExpires < new Date()) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'OTP has expired',
        });
      }
  
      const isOTPValid = await bcrypt.compare(otp, user.passwordResetOTP);
      if (!isOTPValid) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid OTP',
        });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetOTP: null,
          passwordResetExpires: null,
        },
      });
  
      return reply.code(200).send({
        statusCode: 200,
        message: 'Password has been reset successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Invalid input data',
          details: error.errors,
        });
      } else {
        console.error('Password reset error:', error);
        return reply.code(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Failed to reset password',
        });
      }
    }
  };