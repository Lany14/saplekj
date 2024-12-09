import { UserRole } from "@prisma/client";

export type SignUpInputProps = {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
};

export type SignInInputProps = {
  email: string;
  password: string;
};
