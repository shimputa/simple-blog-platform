import { FastifyPluginAsync } from 'fastify';
import { createPost, getPost, updatePost, deletePost } from '../../handlers/post/post.handler';
import {authenticate} from '../../plugin/auth'

const postRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/',{ preHandler: [authenticate] }, createPost);
  fastify.get('/:id', { preHandler: [authenticate] },getPost);
  fastify.put('/:id',{ preHandler: [authenticate] }, updatePost);
  fastify.delete('/:id',{ preHandler: [authenticate] }, deletePost);
};

export default postRoutes;
