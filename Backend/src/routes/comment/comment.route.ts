
import { FastifyPluginAsync } from 'fastify';
import { createComment, getComment, updateComment, deleteComment } from '../../handlers/comment/comment.handler';
import {authenticate} from '../../plugin/auth'

const commentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', { preHandler: [authenticate] }, createComment);  
  fastify.get('/:id',{ preHandler: [authenticate] }, getComment);   
  fastify.put('/:id', { preHandler: [authenticate] },updateComment);  
  fastify.delete('/:id',{ preHandler: [authenticate] }, deleteComment); 
};

export default commentRoutes;
