import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Report } from 'src/reports/entities/report.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export const dataSource = new DataSource({
  type: 'mysql',
  host: configService.getOrThrow('MYSQL_HOST'),
  port: configService.getOrThrow('MYSQL_PORT'),
  username: configService.getOrThrow('MYSQL_USERNAME'),
  password: configService.getOrThrow('MYSQL_PASSWORD'),
  database: configService.getOrThrow('MYSQL_DATABASE'),
  entities: [User, Report],
  migrations: ['dist/migrations/*.js'],
});
