import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password, name } = req.body as { email: string; password: string; name: string };
  const user = await prisma.user.create({
    data: { email, password, name },
  });
  reply.code(201).send(user);
};

export const getUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
  if (user) {
    reply.send(user);
  } else {
    reply.code(404).send({ error: 'User not found' });
  }
};

export const updateUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { email, password, name } = req.body as { email: string; password: string; name: string };
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { email, password, name },
  });
  reply.send(user);
};

export const deleteUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  await prisma.user.delete({ where: { id: parseInt(id) } });
  reply.code(204).send();
};
