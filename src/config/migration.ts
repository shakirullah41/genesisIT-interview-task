import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });
const isProduction = process.env.STAGE === 'prod';
const isTest = process.env.STAGE === 'test';
const config = {
  ssl: isProduction,
  name: 'migration',
  type: 'postgres',
  entities: ['src/../**/*.entity.{js,ts}'],
  synchronize: false,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: isTest
    ? process.env.DB_TEST_DATABASE_NAME
    : process.env.DB_DATABASE_NAME,
  logging: true,
  migrationsTableName: 'migrations',
  migrations: ['migration/*.{js,ts}'],
  cli: {
    migrationsDir: 'migration',
  },
};
export default registerAs('migration', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
