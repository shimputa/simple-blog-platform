import { FastifyPluginAsync } from 'fastify';
import { createUser, getUser, updateUser, deleteUser } from '../../handlers/user/user.handler';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', createUser);
  fastify.get('/:id', getUser);
  fastify.put('/:id', updateUser);
  fastify.delete('/:id', deleteUser);
};

export default userRoutes;
