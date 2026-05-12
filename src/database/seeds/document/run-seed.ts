import { NestFactory } from '@nestjs/core';
import { UserSeedService } from './user/user-seed.service';

import { SeedModule } from './seed.module';
import { CitySeedService } from './city/city-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(UserSeedService).run();

  await app.get(CitySeedService).run();

  await app.close();
};

void runSeed();
