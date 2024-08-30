// src/schemas/comment.schema.ts
import { z } from 'zod';

// Schema for validating the comment ID parameter
export const idSchema = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: 'Invalid ID. ID must be a positive integer.',
  }),
});

// Schema for validating the create and update comment request body
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty').max(500, 'Content cannot exceed 500 characters'),
  postId: z.number().positive('Post ID must be a positive number'),
  authorId: z.number().positive('Author ID must be a positive number'),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty').max(500, 'Content cannot exceed 500 characters'),
});
