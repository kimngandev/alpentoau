import { PrismaClient, User } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

interface Genre {
  name: string;
}

interface Story {
  title: string;
  description: string;
  coverImage: string;
  genre: string;
  author: string;
  authorEmail: string;
}

interface Chapter {
  storyTitle: string;
  title: string;
  number: number;
  content: string;
}

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  try {
    // Seed genres
    console.log('📚 Đang seed genres...');
    const genresPath = path.join(__dirname, '../data/genres.json');
    const genres: Genre[] = JSON.parse(await fs.readFile(genresPath, 'utf8'));

    for (const genre of genres) {
      await prisma.genre.upsert({
        where: { name: genre.name },
        update: {},
        create: { name: genre.name },
      });
    }
    console.log(`✅ Đã tạo ${genres.length} genres`);

    // Seed users (authors)
    console.log('👤 Đang seed users...');
    const storiesPath = path.join(__dirname, '../data/stories.json');
    const stories: Story[] = JSON.parse(await fs.readFile(storiesPath, 'utf8'));

    const uniqueAuthors = [...new Map(stories.map((story) => [
      story.authorEmail,
      { name: story.author, email: story.authorEmail }
    ])).values()];

    const createdUsers: User[] = [];
    for (const author of uniqueAuthors) {
      const user = await prisma.user.upsert({
        where: { email: author.email },
        update: {},
        create: {
          username: author.name,
          email: author.email,
          password: 'hashedpassword123', // bạn nên hash thực tế
          role: 'AUTHOR',
        },
      });
      createdUsers.push(user);
    }
    console.log(`✅ Đã tạo ${createdUsers.length} users`);

    // Seed stories
    console.log('📖 Đang seed stories...');
    for (const story of stories) {
      const genre = await prisma.genre.findFirst({ where: { name: story.genre } });
      const author = await prisma.user.findFirst({ where: { email: story.authorEmail } });

      if (!genre) {
        console.warn(`⚠️ Không tìm thấy thể loại: ${story.genre}`);
        continue;
      }

      if (!author) {
        console.warn(`⚠️ Không tìm thấy tác giả: ${story.authorEmail}`);
        continue;
      }

      await prisma.story.upsert({
        where: { title: story.title },
        update: {},
        create: {
          title: story.title,
          description: story.description,
          coverImage: story.coverImage,
          genreId: genre.id,
          authorId: author.id,
        },
      });
    }
    console.log(`✅ Đã tạo ${stories.length} stories`);

    // Seed chapters
    console.log('📝 Đang seed chapters...');
    const chaptersPath = path.join(__dirname, '../data/chapters.json');
    const chapters: Chapter[] = JSON.parse(await fs.readFile(chaptersPath, 'utf8'));

    for (const chap of chapters) {
      const story = await prisma.story.findFirst({ where: { title: chap.storyTitle } });

      if (!story) {
        console.warn(`⚠️ Không tìm thấy truyện: ${chap.storyTitle}`);
        continue;
      }

      await prisma.chapter.upsert({
        where: {
          storyId_number: {
            storyId: story.id,
            number: chap.number,
          },
        },
        update: {},
        create: {
          storyId: story.id,
          title: chap.title,
          number: chap.number,
          content: chap.content,
        },
      });
    }
    console.log(`✅ Đã tạo ${chapters.length} chapters`);

  } catch (error) {
    console.error('❌ Lỗi trong quá trình seed:', error);
    throw error;
  }
}

main()
  .then(() => {
    console.log('🎉 Seed hoàn tất thành công!');
  })
  .catch((e) => {
    console.error('💥 Seed thất bại:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
