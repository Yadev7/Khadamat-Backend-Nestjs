import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import fileConfig from './files/config/file.config';
import facebookConfig from './auth-facebook/config/facebook.config';
import googleConfig from './auth-google/config/google.config';
import appleConfig from './auth-apple/config/apple.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAppleModule } from './auth-apple/auth-apple.module';
import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './mail/mail.module';
import { HomeModule } from './home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { SessionModule } from './session/session.module';
import { MailerModule } from './mailer/mailer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { DatabaseConfig } from './database/config/database-config.type';

import { CountriesModule } from './countries/countries.module';

import { CitiesModule } from './cities/cities.module';

import { LocalisationsModule } from './localisations/localisations.module';

import { CityAreasModule } from './city-areas/city-areas.module';

import { AddressesModule } from './addresses/addresses.module';

import { ContactsModule } from './contacts/contacts.module';

import { EntreprisesModule } from './entreprises/entreprises.module';

import { MembersModule } from './members/members.module';

import { BusinessesModule } from './businesses/businesses.module';

import { ImagesBusinessesModule } from './images-businesses/images-businesses.module';

import { EvaluationsModule } from './evaluations/evaluations.module';

import { ReportsModule } from './reports/reports.module';

import { CallsModule } from './calls/calls.module';

import { MessagesModule } from './messages/messages.module';

// <database-block>
const infrastructureDatabaseModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    })
  : TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions | undefined) => {
        return new DataSource({
          ...options,
          verboseRetryLog: true,
          logging: ['error', 'schema'],
        } as unknown as DataSourceOptions).initialize();
      },
    });
// </database-block>

import { ServicesModule } from './services/services.module';

import { SelectedBusinessesModule } from './selected-businesses/selected-businesses.module';

@Module({
  imports: [
    SelectedBusinessesModule,
    ServicesModule,
    MessagesModule,
    CallsModule,
    ReportsModule,
    EvaluationsModule,
    ImagesBusinessesModule,
    BusinessesModule,
    MembersModule,
    EntreprisesModule,
    ContactsModule,
    AddressesModule,
    ServicesModule,
    CityAreasModule,
    LocalisationsModule,
    CitiesModule,
    CountriesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
        appleConfig,
      ],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
        verboseRetryLog: true,
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],

      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    AuthFacebookModule,
    AuthGoogleModule,
    AuthAppleModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
  ],
})
export class AppModule {}
