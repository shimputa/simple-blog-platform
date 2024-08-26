// import { FastifyPluginAsync } from 'fastify';
// import { createComment, getComment, updateComment, deleteComment } from '../../handlers/comment/comment.handler';

// const commentRoutes: FastifyPluginAsync = async (fastify) => {
//   fastify.post('/', createComment);
//   fastify.get('/:id', getComment);
//   fastify.put('/:id', updateComment);
//   fastify.delete('/:id', deleteComment);
// };

// export default commentRoutes;

import { FastifyPluginAsync } from 'fastify';
import { createComment, getComment, updateComment, deleteComment } from '../../handlers/comment/comment.handler';

const commentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', createComment);  // Route for creating a comment
  fastify.get('/:id', getComment);   // Route for getting a comment by ID
  fastify.put('/:id', updateComment);  // Route for updating a comment by ID
  fastify.delete('/:id', deleteComment);  // Route for deleting a comment by ID
};

export default commentRoutes;
