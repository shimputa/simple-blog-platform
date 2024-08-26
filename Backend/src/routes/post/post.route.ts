import { FastifyPluginAsync } from 'fastify';
import { createPost, getPost, updatePost, deletePost } from '../../handlers/post/post.handler';

const postRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', createPost);
  fastify.get('/:id', getPost);
  fastify.put('/:id', updatePost);
  fastify.delete('/:id', deletePost);
};

export default postRoutes;
