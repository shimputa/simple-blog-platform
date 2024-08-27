import { FastifyPluginAsync } from 'fastify';
import { createUser, getUser, updateUser, deleteUser,getAllUsers } from '../../handlers/user/user.handler';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', createUser);
  fastify.get('/:id', getUser);
  fastify.put('/:id', updateUser);
  fastify.delete('/:id', deleteUser);
  fastify.get('/', getAllUsers);
};

export default userRoutes;
