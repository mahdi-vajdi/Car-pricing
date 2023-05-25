import { DataSource, DataSourceOptions } from 'typeorm';

const developmentConfig: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['**/*.entity.js'],
  migrations: ['database/migrations/*.js'],
};

const testConfig: DataSourceOptions = {
  type: 'sqlite',
  database: 'test.sqlite',
  entities: ['**/*.entity.ts'],
  migrations: ['database/migrations/*.ts'],
  migrationsRun: true,
};

const productionConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['**/*.entity.js'],
  migrations: ['database/migrations/*.js'],
  migrationsRun: true,
  ssl: {
    rejectUnauthorized: false,
  },
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
