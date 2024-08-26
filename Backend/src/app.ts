import Fastify from 'fastify';
import userRoutes from './routes/user/user.route';
import postRoutes from './routes/post/post.route';
import commentRoutes from './routes/comment/comment.route';

const app = Fastify({ logger: true });

app.register(userRoutes, { prefix: '/users' });
app.register(postRoutes, { prefix: '/posts' });
app.register(commentRoutes, { prefix: '/comments' });

// server.listen(3000, '0.0.0.0', (err, address) => {
//   if (err) {
//     server.log.error(err);
//     process.exit(1);
//   }
//   server.log.info(`Server listening at ${address}`);
// });
const start = async ()=>{
    try {
        const address= await app.listen({port: 3000,host: '0.0.0.0'});
        app.log.info(`Server is running on port ${address} `);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();