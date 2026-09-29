import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env'), quiet: true });

export const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy apps/toolshop/.env.example to apps/toolshop/.env, or export ${name} in the environment.`,
    );
  }
  return value;
};
