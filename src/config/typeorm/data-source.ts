import { DataSource, DataSourceOptions } from 'typeorm';

const developmentConfig: DataSourceOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'postgre123',
  database: 'car-pricing-db',
  // entities: ['**/*.entity.js'],
  migrations: ['src/config/migrations/*.js'],
};

const testConfig: DataSourceOptions = {
  type: 'sqlite',
  database: 'test.sqlite',
  // entities: ['**/*.entity.ts'],
  migrations: ['database/migrations/*.ts'],
  migrationsRun: true,
};

const productionConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrations: ['dist/config/migrations/*.js'],
  migrationsRun: true,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};

export let dataSourceOptions: DataSourceOptions;

switch (process.env.NODE_ENV) {
  case 'development':
    dataSourceOptions = developmentConfig;
    break;

  case 'test':
    dataSourceOptions = testConfig;

  case 'production':
    dataSourceOptions = productionConfig;
    break;

  default:
    throw new Error('Unknown Enviroment. Please specify NODE_ENV');
}

export const AppDataSource = new DataSource(dataSourceOptions);
