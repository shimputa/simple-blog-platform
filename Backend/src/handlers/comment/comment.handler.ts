import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createComment = async (req: FastifyRequest, reply: FastifyReply) => {
    const { content, postId, authorId } = req.body as {
      content: string;
      postId: number;
      authorId: number;
    };
  
    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          post: { connect: { id: postId } },
          author: { connect: { id: authorId } },
        },
      });
      reply.code(201).send(comment);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating comment:', error.message);
        reply.code(400).send({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        reply.code(500).send({ error: 'An unknown error occurred' });
      }
    }
  };
  

export const getComment = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });
  if (comment) {
    reply.send(comment);
  } else {
    reply.code(404).send({ error: 'Comment not found' });
  }
};

export const updateComment = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { content } = req.body as { content: string };
  const comment = await prisma.comment.update({
    where: { id: parseInt(id) },
    data: { content },
  });
  reply.send(comment);
};

export const deleteComment = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  await prisma.comment.delete({ where: { id: parseInt(id) } });
  reply.code(204).send();
};
