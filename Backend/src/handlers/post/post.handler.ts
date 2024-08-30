// import { FastifyRequest, FastifyReply } from 'fastify';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export const createPost = async (req: FastifyRequest, reply: FastifyReply) => {
//   const { title, content, authorId } = req.body as { title: string; content: string; authorId: number };
//   const post = await prisma.post.create({
//     data: { title, content, authorId },
//   });
//   reply.code(201).send(post);
// };

// export const getPost = async (req: FastifyRequest, reply: FastifyReply) => {
//   const { id } = req.params as { id: string };
//   const post = await prisma.post.findUnique({ where: { id: parseInt(id) }, include: { comments: true } });
//   if (post) {
//     reply.send(post);
//   } else {
//     reply.code(404).send({ error: 'Post not found' });
//   }
// };

// export const updatePost = async (req: FastifyRequest, reply: FastifyReply) => {
//   const { id } = req.params as { id: string };
//   const { title, content } = req.body as { title: string; content: string };
//   const post = await prisma.post.update({
//     where: { id: parseInt(id) },
//     data: { title, content },
//   });
//   reply.send(post);
// };

// export const deletePost = async (req: FastifyRequest, reply: FastifyReply) => {
//   const { id } = req.params as { id: string };
//   await prisma.post.delete({ where: { id: parseInt(id) } });
//   reply.code(204).send();
// };

import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createPostSchema, updatePostSchema } from '../../schemas/postValidation/post.schema'; // Assuming you have these schemas defined
import { z } from 'zod';

const prisma = new PrismaClient();

// Create a new post
export const createPost = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const parsedData = createPostSchema.parse(req.body);
    const { title, content, authorId } = parsedData;

    const post = await prisma.post.create({
      data: { title, content, authorId },
    });

    reply.code(201).send(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // console.error('Validation Error:', error.errors);
      reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid post data',
        details: error.errors,
      });
    } else if (error instanceof Error) {
      // console.error('Prisma Error:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to create post due to server error',
      });
    } else {
      // console.error('Unknown Error:', error);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unknown error occurred',
      });
    }
  }
};

// Get a single post by ID
export const getPost = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { comments: true },
    });

    // if (!post) {
    //   reply.code(404).send({
    //     statusCode: 404,
    //     error: 'Not Found',
    //     message: `Post with ID ${id} not found`,
    //   });
    //   return;
    // }

    // reply.send(post);

    if (post) {
      reply.send(post);
    } else {
      reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: `post with ID ${id} not found`,
      });
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error('Prisma Error:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to retrieve post due to server error',
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

// Update an existing post
export const updatePost = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const parsedData = updatePostSchema.parse(req.body);

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: parsedData,
    });

    reply.send(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation Error:', error.errors);
      reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid post data',
        details: error.errors,
      });
    } else if (error instanceof Error) {
      console.error('Prisma Error:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to update post due to server error',
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

// Delete a post
export const deletePost = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };

  await prisma.$transaction(async (prisma) => {
    // Delete all related comments first
    await prisma.comment.deleteMany({
      where: { postId: parseInt(id) },
    });

    // Then delete the post
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });
  });


    reply.code(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation Error:', error.errors);
      reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid post ID format',
        details: error.errors,
      });
    } else if (error instanceof Error) {
      console.error('Prisma Error:', error.message);
      reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to delete post due to server error',
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
