import { FastifyPluginAsync } from 'fastify';
import {getUser, updateUser, deleteUser,getAllUsers,getRecentlyLoggedInUsers } from '../../handlers/user/user.handler';
import { authenticate } from '../../plugin/auth';
// import { registerUser, loginUser } from '../handlers/auth/auth.handler';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticate); // Apply authentication to all route

  // fastify.post('/', createUser);
  fastify.get('/:id', getUser);
  fastify.put('/:id', updateUser);
  fastify.delete('/:id', deleteUser);
  fastify.get('/', getAllUsers);
  fastify.get('/recent-logins', getRecentlyLoggedInUsers);
};

export default userRoutes;
