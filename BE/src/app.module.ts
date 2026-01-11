import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user.module';
import { AllExceptionsFilter } from './shared/exceptions/all-exceptions.filter';
import { databaseConfig } from './infrastructure/config/database.config';
import { DashboardModule } from './modules/dashboard.module';
import { SubjectModule } from './modules/subject.module';
import { LevelModule } from './modules/level.module';
import { LearningModule } from './modules/learning.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM Module
    TypeOrmModule.forRoot(databaseConfig),

    // Feature Modules
    UserModule,
    DashboardModule,
    SubjectModule,
    LevelModule,
    LearningModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule { }
