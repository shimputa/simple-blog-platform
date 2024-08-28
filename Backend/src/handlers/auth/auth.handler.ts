// import {FastifyRequest, FastifyReply } from 'fastify';
// import fastifyJwt from '@fastify/jwt';
// import bcrypt from 'bcryptjs';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// import { z } from 'zod';
// import { registerSchema, loginSchema } from '../../schemas/auth validation/auth.schema';

// // Secret key for JWT (store securely in environment variables in production)
// const JWT_SECRET = 'your_jwt_secret';

// // Register a new usery
// export const registerUser = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const parsedData = registerSchema.parse(req.body);
//     const { email, password, name } = parsedData;

//     // Check if user with the same email already exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       reply.code(409).send({
//         statusCode: 409,
//         error: 'Conflict',
//         message: 'User with this email already exists',
//       });
//       return;
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the new user
//     const user = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         name,
//       },
//     });

//     reply.code(201).send(user);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       reply.code(400).send({
//         statusCode: 400,
//         error: 'Bad Request',
//         message: 'Invalid input data',
//         details: error.errors,
//       });
//     } else if (error instanceof Error) {
//       reply.code(500).send({
//         statusCode: 500,
//         error: 'Internal Server Error',
//         message: 'Failed to register user due to server error',
//       });
//     } else {
//       reply.code(500).send({
//         statusCode: 500,
//         error: 'Internal Server Error',
//         message: 'An unknown error occurred',
//       });
//     }
//   }
// };

// // User login
// export const loginUser = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const parsedData = loginSchema.parse(req.body);
//     const { email, password } = parsedData;

//     // Find the user by email
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       reply.code(401).send({
//         statusCode: 401,
//         error: 'Unauthorized',
//         message: 'Invalid email or password',
//       });
//       return;
//     }

//     // Create a JWT token
//     const token = req.jwtSign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

//     reply.send({
//       accessToken: token,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//       },
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       reply.code(400).send({
//         statusCode: 400,
//         error: 'Bad Request',
//         message: 'Invalid input data',
//         details: error.errors,
//       });
//     } else if (error instanceof Error) {
//       reply.code(500).send({
//         statusCode: 500,
//         error: 'Internal Server Error',
//         message: 'Failed to log in due to server error',
//       });
//     } else {
//       reply.code(500).send({
//         statusCode: 500,
//         error: 'Internal Server Error',
//         message: 'An unknown error occurred',
//       });
//     }
//   }
// };


import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { registerSchema, loginSchema } from '../../schemas/auth validation/auth.schema';

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

// User login
// export const loginUser = async (req: FastifyRequest, reply: FastifyReply) => {
//     try {
//         const parsedData = loginSchema.parse(req.body);
//         const { email, password } = parsedData;

//         const user = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return reply.code(401).send({
//                 statusCode: 401,
//                 error: 'Unauthorized',
//                 message: 'Invalid email or password',
//             });
//         }

//       //   await prisma.loginActivity.create({
//       //     data: {
//       //         userId: user.id,
//       //         loginTime: new Date(),
//       //     },
//       // });

//         // Create a JWT token using reply.jwtSign
//         const token = await reply.jwtSign({ userId: user.id });

//         // const userac = await prisma.logiuser.create({})

//         return reply.send({
//             accessToken: token,
//             user: {
//                 id: user.id,
//                 email: user.email,
//                 name: user.name,
//             },
//         });
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             return reply.code(400).send({
//                 statusCode: 400,
//                 error: 'Bad Request',
//                 message: 'Invalid input data',
//                 details: error.errors,
//             });
//         } else {
//             return reply.code(500).send({
//                 statusCode: 500,
//                 error: 'Internal Server Error',
//                 message: 'Failed to log in due to server error',
//             });
//         }
//     }
// };

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