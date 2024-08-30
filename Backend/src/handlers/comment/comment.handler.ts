// import { FastifyRequest, FastifyReply } from 'fastify';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export const createComment = async (req: FastifyRequest, reply: FastifyReply) => {
//     const { content, postId, authorId } = req.body as {
//       content: string;
//       postId: number;
//       authorId: number;
//     };
  
//     try {
//       const comment = await prisma.comment.create({
//         data: {
//           content,
//           post: { connect: { id: postId } },
//           author: { connect: { id: authorId } },
//         },
//       });
//       reply.code(201).send(comment);
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error('Error creating comment:', error.message);
//         reply.code(400).send({ error: error.message });
//       } else {
//         console.error('Unknown error:', error);
//         reply.code(500).send({ error: 'An unknown error occurred' });
//       }
//     }
//   };
  

// export const getComment = async (req: FastifyRequest, reply: FastifyReply) => {
//   const { id } = req.params as { id: string };
//   const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });
//   if (comment) {
//     reply.send(comment);
//   } else {
//     reply.code(404).send({ error: 'Comment not found' });
//   }
// };

// export const updateComment = async (req: FastifyRequest, reply: FastifyReply) => {
//   const { id } = req.params as { id: string };
//   const { content } = req.body as { content: string };
//   const comment = await prisma.comment.update({
//     where: { id: parseInt(id) },
//     data: { content },
//   });
//   reply.send(comment);
// };

// export const deleteComment = async (req: FastifyRequest, reply: FastifyReply) => {
//   const { id } = req.params as { id: string };
//   await prisma.comment.delete({ where: { id: parseInt(id) } });
//   reply.code(204).send();
// };


// src/handlers/comment.handler.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { idSchema, createCommentSchema, updateCommentSchema } from '../../schemas/commentValidation/comment.schema';
import { z } from 'zod';

const prisma = new PrismaClient();

// Create a comment
export const createComment = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // Validate the request body
    const parsedData = createCommentSchema.parse(req.body);

    const { content, postId, authorId }=parsedData;
    
    // Create the comment in the database
    const comment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: authorId } },
      },
    });

    reply.code(201).send(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: error.errors.map(e => e.message).join(', '),
        details: error.errors,
      });
    } else if (error instanceof Error) {
      console.error('Error creating comment:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to create comment due to server error',
      });
    } else {
      console.error('Unknown error:', error);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unknown error occurred',
      });
    }
  }
};

// Get a comment by ID
export const getComment = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // Validate the `id` parameter
    const { id } = idSchema.parse(req.params);

    // Fetch the comment from the database
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });

    if (comment) {
      reply.send(comment);
    } else {
      reply.code(404).send({ error: 'Comment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: error.errors.map(e => e.message).join(', '),
        details: error.errors,
      });
    } else if (error instanceof Error) {
      console.error('Error fetching comment:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch comment due to server error',
      });
    } else {
      console.error('Unknown error:', error);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unknown error occurred',
      });
    }
  }
};

// Update a comment by ID
export const updateComment = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // Validate the `id` parameter
    const { id } = idSchema.parse(req.params);

    // Validate the request body
    const { content } = updateCommentSchema.parse(req.body);

    // Update the comment in the database
    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    reply.send(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: error.errors.map(e => e.message).join(', '),
        details: error.errors,
      });
    } else if (error instanceof Error) {
      console.error('Error updating comment:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to update comment due to server error',
      });
    } else {
      console.error('Unknown error:', error);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unknown error occurred',
      });
    }
  }
};

// Delete a comment by ID
export const deleteComment = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // Validate the `id` parameter
    const { id } = idSchema.parse(req.params);

    // Delete the comment from the database
    await prisma.comment.delete({ where: { id: parseInt(id) } });

    reply.code(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: error.errors.map(e => e.message).join(', '),
        details: error.errors,
      });
    } else if (error instanceof Error) {
      console.error('Error deleting comment:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to delete comment due to server error',
      });
    } else {
      console.error('Unknown error:', error);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unknown error occurred',
      });
    }
  }
};
