import { FastifyPluginAsync } from 'fastify';
import {loginUser,registerUser ,requestPasswordReset, verifyOTPAndResetPassword} from '../../handlers/auth/auth.handler';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/register', registerUser);
  fastify.post('/login', loginUser);
  fastify.post('/password-reset-request', requestPasswordReset);
  fastify.post('/password-reset', verifyOTPAndResetPassword);
};

export default authRoutes;