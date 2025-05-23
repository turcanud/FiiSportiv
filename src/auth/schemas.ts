import {z} from "zod";

export const signInSchema = z.object({
  email: z.string().email({message: "Please enter a valid email address."}),
  password: z
    .string()
    .min(8, {message: "Password must be at least 8 characters."}),
});

export const changeNameSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(25, {
      message: "Name must be no more than 25 characters.",
    }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(50, {
        message: "Password must be no more than 50 characters.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),
    newPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(50, {
        message: "Password must be no more than 50 characters.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(25, {
        message: "Name must be no more than 25 characters.",
      }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(50, {
        message: "Password must be no more than 50 characters.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verificationCodeSchema = z.object({
  code: z.string(),
});

export const sessionSchema = z.object({
  id: z.string(),
});
export type UserSession = z.infer<typeof sessionSchema>;

export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax";
      expires?: number;
    }
  ) => void;
  get: (key: string) => {name: string; value: string} | undefined;
  delete: (key: string) => void;
};

export type PasswordData = {
  password: string;
  salt: string;
  hashedPassword: string;
};
