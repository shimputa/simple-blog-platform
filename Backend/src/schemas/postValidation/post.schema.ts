import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  authorId: z.number().int().positive('Author ID must be a positive integer'),
});

export const updatePostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});