export const envMapper = {
  PORT: Number,
  ORIGIN: String,
  DB_HOST: String,
  DB_USER: String,
  DB_PORT: Number,
  DB_PASS: String,
  DB_DATABASE: String,
  JWT_SECRET: String,
  JWT_EXPIRATION_TIME: String,
};

export type EnvMapper = typeof envMapper;
export type EnvKey = keyof EnvMapper;
