
// import { FastifyRequest, FastifyReply } from 'fastify';
// import { PrismaClient } from '@prisma/client';
// import { z } from 'zod';
// import { userSchema, userIdSchema } from '../../schemas/user.schema';

// const prisma = new PrismaClient();

// export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const parsedData = userSchema.parse(req.body);
//     const user = await prisma.user.create({
//       data: parsedData,
//     });
//     reply.code(201).send(user);
//   } catch (error) {
//     handleError(error, reply);
//   }
// };

// export const getUser = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const { id } = userIdSchema.parse(req.params);
//     const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
//     if (user) {
//       reply.send(user);
//     } else {
//       reply.code(404).send({ error: 'User not found' });
//     }
//   } catch (error) {
//     handleError(error, reply);
//   }
// };

// export const updateUser = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const { id } = userIdSchema.parse(req.params);
//     const parsedData = userSchema.parse(req.body);
//     const user = await prisma.user.update({
//       where: { id: parseInt(id) },
//       data: parsedData,
//     });
//     reply.send(user);
//   } catch (error) {
//     handleError(error, reply);
//   }
// };

// export const deleteUser = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const { id } = userIdSchema.parse(req.params);
//     await prisma.user.delete({ where: { id: parseInt(id) } });
//     reply.code(204).send();
//   } catch (error) {
//     handleError(error, reply);
//   }
// };

// export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const users = await prisma.user.findMany();
//     reply.send(users);
//   } catch (error) {
//     handleError(error, reply);
//   }
// };

// // Utility function to handle errors
// const handleError = (error: unknown, reply: FastifyReply) => {
//   if (error instanceof z.ZodError) {
//     console.error('Validation error:', error.errors);
//     reply.code(400).send({ error: 'Validation failed', details: error.errors });
//   } else if (error instanceof Error) {
//     console.error('Error:', error.message);
//     reply.code(400).send({ error: error.message });
//   } else {
//     console.error('Unknown error:', error);
//     reply.code(500).send({ error: 'An unknown error occurred' });
//   }
// };


import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { userSchema, userIdSchema } from '../../schemas/user.schema';
const prisma = new PrismaClient();

// Create a new user
export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const parsedData = userSchema.parse(req.body);

    // Check if user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: parsedData.email },
    });

    if (existingUser) {
      reply.code(409).send({
        statusCode: 409,
        error: 'Conflict',
        message: 'User with this email already exists',
      });
      return;
    }

    // Create the new user
    const user = await prisma.user.create({
      data: parsedData,
    });
    reply.code(201).send(user);
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
        message: 'Failed to create user due to server error',
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

// Get a specific user by ID
export const getUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = userIdSchema.parse(req.params);
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
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
    const users = await prisma.user.findMany();
    reply.send(users);
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

