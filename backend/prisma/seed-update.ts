import { PrismaClient, UserRole, StoryStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Function to generate slugs, same as in seed.ts
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  console.log('🔄 Updating existing database with additional seed data...');

  // 1. CREATE MISSING GENRES
  console.log('\n🏷️ Adding missing genres...');
  const genresData = [
    { name: 'Tiên Hiệp' },
    { name: 'Kiếm Hiệp' },
    { name: 'Ngôn Tình' },
    { name: 'Đam Mỹ' },
    { name: 'Fantasy' },
    { name: 'Trọng Sinh' },
    { name: 'Xuyên Không' },
    { name: 'Linh Dị' },
    { name: 'Trinh Thám' },
  ];

  for (const genreData of genresData) {
    const slug = slugify(genreData.name);
    await prisma.genre.upsert({
      where: { slug },
      update: {},
      create: {
        name: genreData.name,
        slug: slug,
      },
    });
  }
  console.log('✅ Missing genres added.');

  // Ensure we have at least one author
  let author = await prisma.user.findFirst({ where: { role: UserRole.AUTHOR }});
  if (!author) {
      const authorPassword = await bcrypt.hash('authorpass123', 10);
      author = await prisma.user.create({
          data: {
              username: 'tacgia_phu',
              email: 'author_extra@webtruyen.com',
              password: authorPassword,
              role: UserRole.AUTHOR,
              isVerified: true
          }
      });
      console.log('✅ Created a fallback author.');
  }


  // 2. CREATE ADDITIONAL STORIES
  console.log('\n📚 Adding additional stories...');
  const storiesData = [
    {
      title: 'Đấu Phá Thương Khung',
      description: 'Hành trình của Tiêu Viêm từ một phế vật trở thành cường giả.',
      coverImage: '/images/story3.jpg',
      status: StoryStatus.COMPLETED,
      authorId: author.id,
    },
    {
      title: 'Thiên Quan Tứ Phúc',
      description: 'Mối tình éo le kéo dài 800 năm của Tạ Liên và Hoa Thành.',
      coverImage: '/images/story4.jpg',
      status: StoryStatus.COMPLETED,
      authorId: author.id,
    },
  ];

  for (const story of storiesData) {
      const slug = slugify(story.title);
      await prisma.story.upsert({
        where: { slug },
        update: {},
        create: {
          ...story,
          slug: slug,
        },
      });
  }
  console.log('✅ Additional stories created.');
  
  // 3. CREATE ADDITIONAL CHAPTERS
  const storyForChapters = await prisma.story.findFirst({ where: { slug: 'dau-pha-thuong-khung' }});
  if (storyForChapters) {
      console.log(`\n📖 Adding chapters for "${storyForChapters.title}"...`);
      for (let i = 6; i <= 10; i++) {
        const chapterTitle = `Chương ${i}: Diễn biến mới`;
        const chapterSlug = slugify(chapterTitle);
        await prisma.chapter.upsert({
            where: { storyId_slug: { storyId: storyForChapters.id, slug: chapterSlug } },
            update: {},
            create: {
                title: chapterTitle,
                slug: chapterSlug,
                content: `Đây là nội dung của chương ${i} cho truyện ${storyForChapters.title}.`,
                number: i,
                storyId: storyForChapters.id,
            },
        });
      }
      console.log('✅ Additional chapters created.');
  }


  console.log('🎉 Update seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ An error occurred during update seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
