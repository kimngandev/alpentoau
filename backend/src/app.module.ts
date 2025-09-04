import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoriesModule } from './stories/stories.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, StoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
https://archiveofourown.org/