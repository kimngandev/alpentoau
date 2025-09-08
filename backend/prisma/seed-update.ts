import { PrismaClient, UserRole, StoryStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating existing database with additional seed data...');

  // Check existing data
  const existingUsersCount = await prisma.user.count();
  const existingStoriesCount = await prisma.story.count();
  const existingGenresCount = await prisma.genre.count();
  
  console.log(`📊 Current database state:`);
  console.log(`   Users: ${existingUsersCount}`);
  console.log(`   Stories: ${existingStoriesCount}`);
  console.log(`   Genres: ${existingGenresCount}`);

  // 1. CREATE MISSING GENRES (chỉ dùng name, không dùng slug)
  console.log('\n🏷️ Adding missing genres...');
  const genresData = [
    { name: 'Tiên Hiệp' },
    { name: 'Kiếm Hiệp' },
    { name: 'Ngôn Tình' },
    { name: 'Đam Mỹ' },
    { name: 'Fantasy' },
    { name: 'Phiêu Lưu' },
    { name: 'Huyền Huyễn' },
    { name: 'Đô Thị' },
    { name: 'Trọng Sinh' },
    { name: 'Xuyên Không' },
    { name: 'Linh Dị' },
    { name: 'Trinh Thám' },
  ];

  const createdGenres = [];
  for (const genreData of genresData) {
    try {
      const genre = await prisma.genre.upsert({
        where: { name: genreData.name },
        update: {}, // Không update nếu đã tồn tại
        create: genreData,
      });
      createdGenres.push(genre);
      console.log(`   ✅ Genre processed: ${genre.name}`);
    } catch (error) {
      console.log(`   ⚠️ Genre already exists or error: ${genreData.name}`);
    }
  }
  console.log(`✅ Genres processed: ${createdGenres.length} genres now available`);

  // 2. CREATE SAMPLE USERS
  console.log('\n👤 Adding sample users...');
  const password = await bcrypt.hash('demo123456', 10);
  
  const sampleUsers = [
    {
      username: 'admin_demo',
      email: 'admin@demo.com',
      role: UserRole.ADMIN,
    },
    {
      username: 'author_demo',
      email: 'author@demo.com', 
      role: UserRole.AUTHOR,
    },
    {
      username: 'user_demo',
      email: 'user@demo.com',
      role: UserRole.USER,
    },
  ];

  const createdUsers = [];
  for (const userData of sampleUsers) {
    try {
      const user = await prisma.user.create({
        data: {
          ...userData,
          password,
          isVerified: true,
        },
      });
      createdUsers.push(user);
      console.log(`   ✅ Created user: ${user.username} (${user.email})`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`   ⚠️ User already exists: ${userData.email}`);
      } else {
        console.log(`   ❌ Error creating user ${userData.email}:`, error.message);
      }
    }
  }

  // 3. ADD SAMPLE STORIES (nếu có authors)
  const existingAuthors = await prisma.user.findMany({
    where: { role: UserRole.AUTHOR },
    take: 3,
  });

  if (existingAuthors.length > 0) {
    console.log('\n📚 Adding sample stories...');
    
    // Lấy genres có sẵn
    const availableGenres = await prisma.genre.findMany();
    
    const sampleStories = [
      {
        title: 'Demo Story - Hành Trình Tu Tiên',
        description: 'Câu chuyện demo về hành trình tu tiên đầy gian khó của một thiếu niên bình thường. Với ý chí kiên cường và những cuộc gặp gỡ định mệnh, liệu anh có thể vượt qua mọi thử thách để đạt đến đỉnh cao của sức mạnh?',
        coverImage: 'https://placehold.co/300x400/8b5cf6/white?text=Tu+Tien',
        status: StoryStatus.ONGOING,
        authorId: existingAuthors[0].id,
        // Chỉ assign genre đầu tiên có sẵn
        genreId: availableGenres.length > 0 ? availableGenres[0].id : null,
      },
      {
        title: 'Demo Story - Tình Yêu Thầm Lặng',
        description: 'Một câu chuyện ngọt ngào về tình yêu học đường. Hai người bạn thân từ thuở nhỏ dần nhận ra tình cảm đặc biệt dành cho nhau, nhưng liệu họ có đủ can đảm để thổ lộ?',
        coverImage: 'https://placehold.co/300x400/ec4899/white?text=Love+Story',
        status: StoryStatus.COMPLETED,
        authorId: existingAuthors[1] ? existingAuthors[1].id : existingAuthors[0].id,
        genreId: availableGenres.length > 1 ? availableGenres[1].id : (availableGenres.length > 0 ? availableGenres[0].id : null),
      },
    ];

    for (const storyData of sampleStories) {
      try {
        // Chỉ tạo story nếu có genre
        if (!storyData.genreId) {
          console.log(`   ⚠️ Skipping story ${storyData.title} - no genres available`);
          continue;
        }

        const story = await prisma.story.create({
          data: storyData,
        });

        // Add sample chapters
        for (let i = 1; i <= 3; i++) {
          await prisma.chapter.create({
            data: {
              storyId: story.id,
              title: `Chương ${i}: ${getRandomChapterTitle()}`,
              number: i,
              content: getRandomChapterContent(story.title, i),
            },
          });
        }

        console.log(`   ✅ Created story: ${story.title} (3 chapters)`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`   ⚠️ Story already exists: ${storyData.title}`);
        } else {
          console.log(`   ❌ Error creating story ${storyData.title}:`, error.message);
        }
      }
    }
  }

  // 4. ADD SAMPLE INTERACTIONS
  const existingUsers = await prisma.user.findMany({
    where: { role: UserRole.USER },
    take: 5,
  });

  const existingStories = await prisma.story.findMany({
    take: 5,
  });

  if (existingUsers.length > 0 && existingStories.length > 0) {
    console.log('\n💬 Adding sample interactions...');
    
    // Add comments
    const commentTexts = [
      'Truyện hay quá! Cảm ơn tác giả!',
      'Cốt truyện cuốn hút, không thể ngừng đọc!',
      'Chờ chương tiếp theo!',
      'Nhân vật được xây dựng rất tốt!',
      'Recommend cho mọi người!',
    ];

    for (let i = 0; i < 5; i++) {
      const randomUser = existingUsers[Math.floor(Math.random() * existingUsers.length)];
      const randomStory = existingStories[Math.floor(Math.random() * existingStories.length)];
      const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];

      try {
        await prisma.comment.create({
          data: {
            userId: randomUser.id,
            // Sử dụng chapterId thay vì storyId nếu schema yêu cầu
            chapterId: await getRandomChapterId(randomStory.id),
            content: randomText,
          },
        });
      } catch (error) {
        // Skip if error - có thể do schema khác
        console.log(`   ⚠️ Comment creation skipped: ${error.message}`);
      }
    }

    console.log('   ✅ Added sample comments');
  }

  // Final summary
  const finalUsersCount = await prisma.user.count();
  const finalStoriesCount = await prisma.story.count();
  const finalGenresCount = await prisma.genre.count();

  console.log('\n🎉 Database update completed!');
  console.log(`📊 Updated database state:`);
  console.log(`   Users: ${existingUsersCount} → ${finalUsersCount} (+${finalUsersCount - existingUsersCount})`);
  console.log(`   Stories: ${existingStoriesCount} → ${finalStoriesCount} (+${finalStoriesCount - existingStoriesCount})`);
  console.log(`   Genres: ${existingGenresCount} → ${finalGenresCount} (+${finalGenresCount - existingGenresCount})`);
  console.log('');
  console.log('✅ Your existing data is preserved!');
  console.log('🆕 New demo accounts:');
  console.log('   - admin@demo.com / demo123456');
  console.log('   - author@demo.com / demo123456');
  console.log('   - user@demo.com / demo123456');
}

async function getRandomChapterId(storyId: number) {
  const chapters = await prisma.chapter.findMany({
    where: { storyId },
    select: { id: true },
  });
  return chapters.length > 0 ? chapters[0].id : null;
}

function getRandomChapterTitle(): string {
  const titles = [
    'Khởi đầu hành trình',
    'Cuộc gặp gỡ định mệnh', 
    'Bí mật được tiết lộ',
    'Thử thách đầu tiên',
    'Người bạn đồng hành',
    'Nguy hiểm rình rập',
    'Quyết định khó khăn',
    'Trận chiến sinh tử',
    'Sức mạnh thức tỉnh',
    'Hành trình mới bắt đầu',
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomChapterContent(storyTitle: string, chapterNumber: number): string {
  return `Đây là nội dung demo cho chương ${chapterNumber} của truyện "${storyTitle}".

Trong chương này, câu chuyện tiếp tục phát triển với những diễn biến hấp dẫn. Nhân vật chính đã phải đối mặt với những thử thách mới, đòi hỏi sự can đảm và trí tuệ để vượt qua.

"Chúng ta phải hành động ngay bây giờ," một giọng nói quyết đoán vang lên. "Không còn thời gian để do dự nữa."

Ánh mắt quyết tâm hiện rõ trên gương mặt của nhân vật chính. Dù biết rằng con đường phía trước đầy gian nan, nhưng họ đã sẵn sàng đối mặt với mọi khó khăn.

Câu chuyện sẽ tiếp tục trong chương sau với những bất ngờ thú vị...

(Đây là nội dung demo được tạo tự động)`;
}

main()
  .catch((e) => {
    console.error('❌ Error during database update:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });