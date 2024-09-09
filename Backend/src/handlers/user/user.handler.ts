
import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { userSchema, userIdSchema } from '../../schemas/user.schema';
const prisma = new PrismaClient();

export const getUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = userIdSchema.parse(req.params);
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (user) {
      reply.send(user);
    } else {
      reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: `User with ID ${id} not found`,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation Error:', error.errors);
      reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid user ID format',
        details: error.errors,
      });
    } else if (error instanceof Error) {
      console.error('Prisma Error:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to retrieve user due to server error',
      });
    } else {
      console.error('Unknown Error:', error);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unknown error occurred',
      });
    }
  }
};

// Update an existing user
export const updateUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = userIdSchema.parse(req.params);
    const parsedData = userSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: parsedData,
    });
    reply.send(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation Error:', error.errors);
      reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid input data',
        details: error.errors,
      });
    } else if (error instanceof Error) {
      console.error('Prisma Error:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to update user due to server error',
      });
    } else {
      console.error('Unknown Error:', error);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unknown error occurred',
      });
    }
  }
};

// Delete a user
export const deleteUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = userIdSchema.parse(req.params);
    await prisma.user.delete({ where: { id: parseInt(id) } });
    reply.code(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation Error:', error.errors);
      reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid user ID format',
        details: error.errors,
      });
    } else if (error instanceof Error) {
      console.error('Prisma Error:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to delete user due to server error',
      });
    } else {
      console.error('Unknown Error:', error);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unknown error occurred',
      });
    }
  }
};

// Get all users
export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (users.length === 0) {
      reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'No users found.',
      });
    } else {
      reply.send(users);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Prisma Error:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to retrieve users due to server error',
      });
    } else {
      console.error('Unknown Error:', error);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unknown error occurred',
      });
    }
  }
};

// recent-login users

export const getRecentlyLoggedInUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const recentLogins = await prisma.loginActivity.findMany({
      where: {
        loginTime: {
          gte: new Date(new Date().setDate(new Date().getDate() - 1)), // Last 24 hours
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        loginTime: 'desc',
      },
    });

    if (recentLogins.length === 0) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'No recently logged-in users found.',
      });
    }

    const users = recentLogins.map((login) => ({
      id: login.user.id,
      email: login.user.email,
      name: login.user.name,
      loginTime: login.loginTime,
    }));

    return reply.send({ users });
  } catch (error) {
    console.error('Error fetching recently logged-in users:', error);
    return reply.code(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Failed to fetch recently logged-in users',
    });
  }
};

// export const getRecentlyLoggedInUsers = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const recentLogins = await prisma.loginActivity.findMany({
//       where: {
//         loginTime: {
//           gte: new Date(new Date().setDate(new Date().getDate() - 1)), // Last 24 hours
//         },
//       },
//       include: {
//         user: true,
//       },
//       orderBy: {
//         loginTime: 'desc',
//       },
//     });

//       const users = recentLogins.map((login: { user: { id: any; email: any; name: any; }; loginTime: any; }) => ({
//           id: login.user.id,
//           email: login.user.email,
//           name: login.user.name,
//           loginTime: login.loginTime,
//       }));

//       return reply.send({ users });
//   } catch (error) {
//       return reply.code(500).send({
//           statusCode: 500,
//           error: 'Internal Server Error',
//           message: 'Failed to fetch recently logged-in users',
//       });
//   }
// };

