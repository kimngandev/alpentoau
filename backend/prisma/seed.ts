import { PrismaClient, UserRole, StoryStatus, AdType, AdPosition } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize Unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Users
  const adminPassword = await bcrypt.hash('admin123456', 10);
  const userPassword = await bcrypt.hash('user123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@webtruyen.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@webtruyen.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  const author1 = await prisma.user.upsert({
    where: { email: 'author1@webtruyen.com' },
    update: {},
    create: {
      username: 'Alpentou',
      email: 'author1@webtruyen.com',
      password: userPassword,
      role: UserRole.AUTHOR,
      isVerified: true,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'user1@webtruyen.com' },
    update: {},
    create: {
      username: 'docgia01',
      email: 'user1@webtruyen.com',
      password: userPassword,
      role: UserRole.USER,
      isVerified: true,
    },
  });

  console.log('✅ Users created.');

  // Create Genres
  const genresData = [
    { name: 'Phiêu Lưu', slug: 'phieu-luu' },
    { name: 'Huyền Huyễn', slug: 'huyen-huyen' },
    { name: 'Đô Thị', slug: 'do-thi' },
    { name: 'Tiên Hiệp', slug: 'tien-hiep' },
    { name: 'Ngôn Tình', slug: 'ngon-tinh' },
  ];

  for (const genre of genresData) {
    await prisma.genre.upsert({
      where: { slug: genre.slug },
      update: {},
      create: genre,
    });
  }
  const allGenres = await prisma.genre.findMany();
  console.log('✅ Genres created.');

  // Create Stories
  const storiesData = [
    {
      title: 'Ma Đạo Tổ Sư',
      slug: 'ma-dao-to-su',
      description: 'Câu chuyện về Ngụy Vô Tiện và Lam Vong Cơ.',
      coverImage: '/images/madaotosu.jpg',
      authorId: author1.id,
      status: StoryStatus.COMPLETED,
      genres: ['Huyền Huyễn', 'Tiên Hiệp'],
    },
    {
        title: 'Thám Tử Lừng Danh Conan',
        slug: 'tham-tu-lung-danh-conan',
        description: 'Cậu thám tử học sinh Kudo Shinichi bị teo nhỏ thành Edogawa Conan.',
        coverImage: '/images/story1.jpg',
        authorId: author1.id,
        status: StoryStatus.ONGOING,
        genres: ['Đô Thị', 'Phiêu Lưu'],
    },
  ];

  for (const storyData of storiesData) {
      const genreConnections = allGenres
          .filter(g => storyData.genres.includes(g.name))
          .map(g => ({ genreId: g.id }));

      await prisma.story.upsert({
          where: { slug: storyData.slug },
          update: {},
          create: {
              title: storyData.title,
              slug: storyData.slug,
              description: storyData.description,
              coverImage: storyData.coverImage,
              authorId: storyData.authorId,
              status: storyData.status,
              genres: {
                  create: genreConnections,
              }
          },
      });
  }
  
  const allStories = await prisma.story.findMany();
  console.log('✅ Stories created.');

  // Create Chapters for stories
  for (const story of allStories) {
      for (let i = 1; i <= 5; i++) {
          const chapterTitle = `Chương ${i}: Mở đầu câu chuyện`;
          const chapterSlug = slugify(chapterTitle);
          await prisma.chapter.upsert({
              where: { storyId_slug: {storyId: story.id, slug: chapterSlug} },
              update: {},
              create: {
                  title: chapterTitle,
                  slug: chapterSlug,
                  content: `Đây là nội dung của chương ${i} cho truyện ${story.title}.`,
                  number: i,
                  storyId: story.id,
              },
          });
      }
  }
  console.log('✅ Chapters created.');

  // Create Ads
  await prisma.ad.createMany({
    data: [
      {
        title: 'Quảng cáo Banner Header',
        content: 'Nội dung quảng cáo banner',
        linkUrl: '#',
        type: AdType.IMAGE,
        position: AdPosition.HEADER,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        imageUrl: 'https://placehold.co/970x90/7e22ce/white?text=Banner+Ad'
      },
      {
        title: 'Quảng cáo Popup',
        content: 'Nội dung quảng cáo popup',
        linkUrl: '#',
        type: AdType.IMAGE,
        position: AdPosition.POPUP,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        imageUrl: 'https://placehold.co/400x300/1e40af/white?text=Popup+Ad'
      }
    ],
    skipDuplicates: true,
  });
  console.log('✅ Ads created.');


  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ An error occurred during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

