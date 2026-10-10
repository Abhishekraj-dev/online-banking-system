import { z } from 'zod';

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});


export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── Transfer Schemas ─────────────────────────────────────────────────────────

export const transferSchema = z.object({
  fromAccountId: z.string().min(1, 'Sender account is required'),
  toRecipient: z.string().min(1, 'Recipient account or IBAN is required'),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  description: z.string().max(255).optional(),
  type: z.enum(['TRANSFER', 'BILL_PAYMENT']).default('TRANSFER'),
});

// ─── Pagination ───────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ─── ID Params ────────────────────────────────────────────────────────────────

export const uuidSchema = z.string().uuid('Invalid ID format');
export const mongoIdSchema = uuidSchema; // Backward compatibility

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type TransferInput = z.infer<typeof transferSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
