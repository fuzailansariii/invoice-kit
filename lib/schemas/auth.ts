import * as z from "zod";

// Sign-in Schema
export const signInSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, { error: "Email is required" }),
  password: z
    .string()
    .min(1, { error: "Password is required" })
    .min(6, { error: "Password must be at least 6 characters long" }),
});

// Sign-up Schema

export const signUpSchema = z.object({
  username: z
    .string()
    .min(1, { error: "Fullname is required" })
    .min(2, { error: "Full name must be at least 2 characters" })
    .max(50, { error: "Full name must not exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      error: "Full name can only contain letters and spaces",
    }),
  email: z
    .email("Please enter a valid email address")
    .min(1, { error: "Email is required" }),
  password: z
    .string()
    .min(1, { error: "Password is required" })
    .min(6, { error: "Password must be at least 6 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      error:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .nonempty({ error: "Verification code is required" })
    .min(6, { error: "Verification code must be at least 6 characters" }),
});

export type VerificationCodeFormSchema = z.infer<typeof verificationCodeSchema>;
export type SignUpFormSchema = z.infer<typeof signUpSchema>;
export type SignInFormSchema = z.infer<typeof signInSchema>;
