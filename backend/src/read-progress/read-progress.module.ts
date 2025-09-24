import { Module } from '@nestjs/common';
import { ReadProgressController } from './read-progress.controller';
import { ReadProgressService } from './read-progress.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReadProgressController],
  providers: [ReadProgressService],
  exports: [ReadProgressService],
})
export class ReadProgressModule {}
