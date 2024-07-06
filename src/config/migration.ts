import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });
const isProduction = process.env.STAGE === 'prod';

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
  database: process.env.DB_DATABASE_NAME,
  logging: true,
  migrationsTableName: 'migrations',
  migrations: ['migration/*.{js,ts}'],
  cli: {
    migrationsDir: 'migration',
  },
};
console.log(config);
export default registerAs('migration', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
