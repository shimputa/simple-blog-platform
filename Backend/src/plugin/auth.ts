import { FastifyRequest, FastifyReply } from 'fastify';

export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // Verify the JWT token
    await req.jwtVerify();
  } catch (err) {
    // Send an unauthorized error response if verification fails
    reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or missing token',
    });
  }
};
