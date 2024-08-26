import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async (req: FastifyRequest, reply: FastifyReply) => {
  const { title, content, authorId } = req.body as { title: string; content: string; authorId: number };
  const post = await prisma.post.create({
    data: { title, content, authorId },
  });
  reply.code(201).send(post);
};

export const getPost = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const post = await prisma.post.findUnique({ where: { id: parseInt(id) }, include: { comments: true } });
  if (post) {
    reply.send(post);
  } else {
    reply.code(404).send({ error: 'Post not found' });
  }
};

export const updatePost = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { title, content } = req.body as { title: string; content: string };
  const post = await prisma.post.update({
    where: { id: parseInt(id) },
    data: { title, content },
  });
  reply.send(post);
};

export const deletePost = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  await prisma.post.delete({ where: { id: parseInt(id) } });
  reply.code(204).send();
};
