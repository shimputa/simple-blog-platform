// declare module 'fastify-jwt' {
//     import { FastifyPluginCallback } from 'fastify';
  
//     interface FastifyJWTOptions {
//       secret: string | Buffer;
//       sign?: object;
//       verify?: object;
//     }
  
//     interface FastifyJWT {
//       sign(payload: object, options?: object): string;
//       verify<T>(token: string, options?: object): T;
//     }
  
//     const fastifyJWT: FastifyPluginCallback<FastifyJWTOptions>;
//     export default fastifyJWT;
//   }


// src/types/fastify-jwt.d.ts
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    jwtVerify<T>(options?: fastifyJwt.VerifyOptions): Promise<T>;
  }
  interface FastifyReply {
    jwtSign(payload: string | object | Buffer, options?: fastifyJwt.SignOptions): Promise<string>;
  }
}