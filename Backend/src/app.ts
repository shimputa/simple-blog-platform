import Fastify from 'fastify';
import dotenv from 'dotenv';
import userRoutes from './routes/user/user.route';
import postRoutes from './routes/post/post.route';
import commentRoutes from './routes/comment/comment.route';
import authrRoutes from './routes/auth/auth.route';
import fastifyJwt from '@fastify/jwt';
// Load environment variables
dotenv.config();

const app = Fastify({ logger: true });

// Register the fastify-jwt plugin with your secret key
app.register(fastifyJwt, { secret:'your_jwt_secret'});
// app.register(fastifyJwt, { secret:process.env.JWT_SECRET});

app.register(authrRoutes, { prefix: '/auth' });
app.register(userRoutes, { prefix: '/users' });
app.register(postRoutes, { prefix: '/posts' });
app.register(commentRoutes, { prefix: '/comments' });


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
