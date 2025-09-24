import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StoriesModule } from './stories/stories.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { AdsModule } from './ads/ads.module';
import { AdminModule } from './admin/admin.module';
import { GenresModule } from './genres/genres.module';
import { ReadProgressModule } from './read-progress/read-progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    StoriesModule,
    CommentsModule,
    BookmarksModule,
    AdsModule,
    AdminModule,
    GenresModule,
    ReadProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
