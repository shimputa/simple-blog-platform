// import { z } from 'zod';

// export const createUserSchema = z.object({
//   body: z.object({
//     email: z.string().email(),
//     password: z.string().min(6),
//     name: z.string().min(3),
//   }),
// });

// export const updateUserSchema = z.object({
//   body: z.object({
//     email: z.string().email().optional(),
//     password: z.string().min(6).optional(),
//     name: z.string().min(3).optional(),
//   }),
// });

// export const userIdParamSchema = z.object({
//   params: z.object({
//     id: z.string().regex(/^\d+$/), // Numeric ID validation
//   }),
// });


import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
});

export const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});
