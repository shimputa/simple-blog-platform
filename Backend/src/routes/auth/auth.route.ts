import { FastifyPluginAsync } from 'fastify';
import {loginUser,registerUser } from '../../handlers/auth/auth.handler';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/register', registerUser);
  fastify.post('/login', loginUser);
};

export default authRoutes;