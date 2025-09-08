// backend/prisma/seed.ts
import { PrismaClient, UserRole, StoryStatus, AdType, AdPosition } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@webtruyen.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@webtruyen.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      isVerified: true,
      bio: 'Quản trị viên hệ thống',
    },
  });

  console.log('✅ Admin user created:', admin.username);

  // Create sample authors
  const authorPassword = await bcrypt.hash('author123456', 10);
  const authors = await Promise.all([
    prisma.user.upsert({
      where: { email: 'author1@webtruyen.com' },
      update: {},
      create: {
        username: 'Alpentou',
        email: 'author1@webtruyen.com',
        password: authorPassword,
        role: UserRole.AUTHOR,
        isVerified: true,
        bio: 'Tác giả chuyên viết truyện fantasy và adventure',
        avatar: 'https://placehold.co/100x100/8b5cf6/white?text=A',
      },
    }),
    prisma.user.upsert({
      where: { email: 'author2@webtruyen.com' },
      update: {},
      create: {
        username: 'Ngã Cật Tây Hồng Thị',
        email: 'author2@webtruyen.com',
        password: authorPassword,
        role: UserRole.AUTHOR,
        isVerified: true,
        bio: 'Tác giả nổi tiếng với các tác phẩm đam mỹ và cổ trang',
        avatar: 'https://placehold.co/100x100/ec4899/white?text=N',
      },
    }),
    prisma.user.upsert({
      where: { email: 'author3@webtruyen.com' },
      update: {},
      create: {
        username: 'Thiên Tằm Thổ Đậu',
        email: 'author3@webtruyen.com',
        password: authorPassword,
        role: UserRole.AUTHOR,
        isVerified: true,
        bio: 'Chuyên gia viết truyện kiếm hiệp và tiên hiệp',
        avatar: 'https://placehold.co/100x100/10b981/white?text=T',
      },
    }),
    prisma.user.upsert({
      where: { email: 'author4@webtruyen.com' },
      update: {},
      create: {
        username: 'Đường Gia Tam Thiếu',
        email: 'author4@webtruyen.com',
        password: authorPassword,
        role: UserRole.AUTHOR,
        isVerified: true,
        bio: 'Tác giả truyện dấu ấn rồng thiêng và đại chúa tể',
        avatar: 'https://placehold.co/100x100/f59e0b/white?text=D',
      },
    }),
  ]);

  console.log('✅ Sample authors created:', authors.map(a => a.username));

  // Create sample users
  const userPassword = await bcrypt.hash('user123456', 10);
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        username: 'DocGiaA',
        email: 'user1@example.com',
        password: userPassword,
        role: UserRole.USER,
        isVerified: true,
        bio: 'Độc giả mê truyện fantasy',
        avatar: 'https://placehold.co/100x100/6366f1/white?text=DA',
      },
    }),
    prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        username: 'DocGiaB',
        email: 'user2@example.com',
        password: userPassword,
        role: UserRole.USER,
        isVerified: true,
        bio: 'Fan của truyện kiếm hiệp',
        avatar: 'https://placehold.co/100x100/ef4444/white?text=DB',
      },
    }),
    prisma.user.upsert({
      where: { email: 'user3@example.com' },
      update: {},
      create: {
        username: 'TruyenFan2024',
        email: 'user3@example.com',
        password: userPassword,
        role: UserRole.USER,
        isVerified: true,
        bio: 'Yêu thích đọc truyện ngôn tình',
        avatar: 'https://placehold.co/100x100/84cc16/white?text=TF',
      },
    }),
  ]);

  console.log('✅ Sample users created:', users.map(u => u.username));

  // Create genres
  const genres = await Promise.all([
    prisma.genre.upsert({
      where: { slug: 'tien-hiep' },
      update: {},
      create: {
        name: 'Tiên Hiệp',
        slug: 'tien-hiep',
        description: 'Thể loại truyện về tu tiên, tu luyện thành tiên, đầy phép thuật và huyền bí',
      },
    }),
    prisma.genre.upsert({
      where: { slug: 'kiem-hiep' },
      update: {},
      create: {
        name: 'Kiếm Hiệp',
        slug: 'kiem-hiep',
        description: 'Thể loại truyện về võ lâm, giang hồ, kiếm khách và nghĩa hiệp',
      },
    }),
    prisma.genre.upsert({
      where: { slug: 'ngon-tinh' },
      update: {},
      create: {
        name: 'Ngôn Tình',
        slug: 'ngon-tinh',
        description: 'Thể loại truyện về tình yêu lãng mạn, cảm động',
      },
    }),
    prisma.genre.upsert({
      where: { slug: 'dam-my' },
      update: {},
      create: {
        name: 'Đam Mỹ',
        slug: 'dam-my',
        description: 'Thể loại truyện về tình yêu giữa hai người nam',
      },
    }),
    prisma.genre.upsert({
      where: { slug: 'fantasy' },
      update: {},
      create: {
        name: 'Fantasy',
        slug: 'fantasy',
        description: 'Thể loại truyện viễn tưởng, phép thuật, thế giới ảo',
      },
    }),
    prisma.genre.upsert({
      where: { slug: 'adventure' },
      update: {},
      create: {
        name: 'Phiêu Lưu',
        slug: 'adventure',
        description: 'Thể loại truyện về cuộc phiêu lưu mạo hiểm, khám phá',
      },
    }),
    prisma.genre.upsert({
      where: { slug: 'huyền-huyễn' },
      update: {},
      create: {
        name: 'Huyền Huyễn',
        slug: 'huyen-huyen',
        description: 'Thể loại truyện huyền ảo, kỳ thú, siêu nhiên',
      },
    }),
    prisma.genre.upsert({
      where: { slug: 'do-thi' },
      update: {},
      create: {
        name: 'Đô Thị',
        slug: 'do-thi',
        description: 'Thể loại truyện lấy bối cảnh đời sống hiện đại',
      },
    }),
  ]);

  console.log('✅ Genres created:', genres.map(g => g.name));

  // Create sample stories
  const stories = await Promise.all([
    prisma.story.upsert({
      where: { title: 'Ma Đạo Tổ Sư' },
      update: {},
      create: {
        title: 'Ma Đạo Tổ Sư',
        slug: 'ma-dao-to-su',
        description: 'Một câu chuyện về Wei Wuxian và Lan Wangji, hai nhân vật chính trong thế giới tu tiên đầy bí ẩn. Wei Wuxian, một thiên tài tu luyện đã từng rung chuyển cả thế giới tu tiên bằng việc tạo ra Ma Đạo - một con đường tu luyện hoàn toàn mới. Sau khi chết và tái sinh, anh gặp lại Lan Wangji và cùng nhau khám phá những bí mật từ quá khứ.',
        coverImage: 'https://placehold.co/300x400/8b5cf6/white?text=Ma+Dao+To+Su',
        status: StoryStatus.COMPLETED,
        authorId: authors[1].id, // Ngã Cật Tây Hồng Thị
        viewCount: 15420,
        totalChapters: 126,
        isPublished: true,
      },
    }),
    prisma.story.upsert({
      where: { title: 'Thám Tử Lừng Danh Conan' },
      update: {},
      create: {
        title: 'Thám Tử Lừng Danh Conan',
        slug: 'tham-tu-lung-danh-conan',
        description: 'Câu chuyện về thám tử nhí Conan Edogawa (thực chất là thám tử trung học Shinichi Kudo bị teo nhỏ) giải quyết những vụ án bí ẩn. Với trí thông minh thiên tài và khả năng suy luận tuyệt vời, Conan luôn tìm ra được sự thật đằng sau những vụ án phức tạp nhất.',
        coverImage: 'https://placehold.co/300x400/6366f1/white?text=Detective+Conan',
        status: StoryStatus.ONGOING,
        authorId: authors[0].id, // Alpentou
        viewCount: 25680,
        totalChapters: 1058,
        isPublished: true,
      },
    }),
    prisma.story.upsert({
      where: { title: 'Đấu Phá Thương Khung' },
      update: {},
      create: {
        title: 'Đấu Phá Thương Khung',
        slug: 'dau-pha-thuong-khung',
        description: 'Câu chuyện về Tiêu Viêm và hành trình tu luyện của anh ta. Từ một thiên tài rơi xuống phế vật, Tiêu Viêm đã vượt qua mọi khó khăn để trở thành một trong những người mạnh nhất thế giới. Cùng với sự giúp đỡ của thầy Dược Lão, anh đã bước trên con đường trở thành Đấu Đế.',
        coverImage: 'https://placehold.co/300x400/10b981/white?text=Dau+Pha+Thuong+Khung',
        status: StoryStatus.COMPLETED,
        authorId: authors[2].id, // Thiên Tằm Thổ Đậu
        viewCount: 18750,
        totalChapters: 1648,
        isPublished: true,
      },
    }),
    prisma.story.upsert({
      where: { title: 'Dấu Ấn Rồng Thiêng' },
      update: {},
      create: {
        title: 'Dấu Ấn Rồng Thiêng',
        slug: 'dau-an-rong-thieng',
        description: 'Long Haochen, một kỵ sĩ Thánh đường trẻ tuổi với tài năng thiên bẩm và trái tim nhân hậu. Anh đã được chọn để tham gia đội Đặc nhiệm Ác ma săn lùng, cùng với những đồng đội ưu tú khác để chống lại loài Ác ma đang đe dọa nhân loại.',
        coverImage: 'https://placehold.co/300x400/f59e0b/white?text=Dau+An+Rong+Thieng',
        status: StoryStatus.ONGOING,
        authorId: authors[3].id, // Đường Gia Tam Thiếu
        viewCount: 12340,
        totalChapters: 520,
        isPublished: true,
      },
    }),
    prisma.story.upsert({
      where: { title: 'Thiên Quan Tứ Phúc' },
      update: {},
      create: {
        title: 'Thiên Quan Tứ Phúc',
        slug: 'thien-quan-tu-phuc',
        description: 'Tạ Liên bay lên thiên giới lần thứ ba, lần này thì không có ai đón tiếp. Sau 800 năm tu luyện, cuối cùng anh cũng có thể bay lên thiên giới lần nữa. Tuy nhiên, ngay khi vừa bay lên, anh đã vô tình phá hủy một số cung điện của các vị thần khác...',
        coverImage: 'https://placehold.co/300x400/ec4899/white?text=Thien+Quan+Tu+Phuc',
        status: StoryStatus.COMPLETED,
        authorId: authors[1].id, // Ngã Cật Tây Hồng Thị
        viewCount: 22100,
        totalChapters: 244,
        isPublished: true,
      },
    }),
    prisma.story.upsert({
      where: { title: 'Quân Lân Thiên Hạ' },
      update: {},
      create: {
        title: 'Quân Lân Thiên Hạ',
        slug: 'quan-lan-thien-ha',
        description: 'Một thiếu niên từ vùng đất hoang vu, bằng ý chí và tài năng của mình đã bước lên con đường xưng vương thiên hạ. Trong thế giới này, thực lực quyết định tất cả, và những người mạnh nhất sẽ đứng trên đỉnh cao của quyền lực.',
        coverImage: 'https://placehold.co/300x400/8b5cf6/white?text=Quan+Lan+Thien+Ha',
        status: StoryStatus.ONGOING,
        authorId: authors[0].id, // Alpentou
        viewCount: 8965,
        totalChapters: 342,
        isPublished: true,
      },
    }),
  ]);

  console.log('✅ Stories created:', stories.map(s => s.title));

  // Assign genres to stories
  const storyGenreAssignments = [
    // Ma Đạo Tổ Sư - Đam Mỹ, Tiên Hiệp, Huyền Huyễn
    { storyIndex: 0, genreIndexes: [3, 0, 6] }, // Đam mỹ, Tiên hiệp, Huyền huyễn
    
    // Detective Conan - Adventure, Fantasy
    { storyIndex: 1, genreIndexes: [5, 4] }, // Phiêu lưu, Fantasy
    
    // Đấu Phá Thương Khung - Tiên Hiệp, Huyền Huyễn
    { storyIndex: 2, genreIndexes: [0, 6] }, // Tiên hiệp, Huyền huyễn
    
    // Dấu Ấn Rồng Thiêng - Fantasy, Adventure
    { storyIndex: 3, genreIndexes: [4, 5] }, // Fantasy, Phiêu lưu
    
    // Thiên Quan Tứ Phúc - Đam Mỹ, Tiên Hiệp
    { storyIndex: 4, genreIndexes: [3, 0] }, // Đam mỹ, Tiên hiệp
    
    // Quân Lân Thiên Hạ - Huyền Huyễn, Fantasy
    { storyIndex: 5, genreIndexes: [6, 4] }, // Huyền huyễn, Fantasy
  ];

  for (const assignment of storyGenreAssignments) {
    for (const genreIndex of assignment.genreIndexes) {
      await prisma.storyGenre.upsert({
        where: { 
          storyId_genreId: { 
            storyId: stories[assignment.storyIndex].id, 
            genreId: genres[genreIndex].id 
          } 
        },
        update: {},
        create: { 
          storyId: stories[assignment.storyIndex].id, 
          genreId: genres[genreIndex].id 
        },
      });
    }
  }

  console.log('✅ Story genres assigned');

  // Create sample chapters
  const chapters = [];
  for (let storyIndex = 0; storyIndex < stories.length; storyIndex++) {
    const story = stories[storyIndex];
    const chapterCount = Math.min(10, Math.floor(story.totalChapters / 10)); // Create 10 chapters per story
    
    for (let i = 1; i <= chapterCount; i++) {
      const chapter = await prisma.chapter.create({
        data: {
          storyId: story.id,
          title: `Chương ${i}: ${getRandomChapterTitle()}`,
          slug: `chuong-${i}`,
          number: i,
          content: getRandomChapterContent(story.title, i),
          isPublished: true,
          viewCount: Math.floor(Math.random() * 1000) + 100,
        },
      });
      chapters.push(chapter);
    }
  }

  console.log('✅ Sample chapters created:', chapters.length);

  // Create sample comments
  const commentTexts = [
    'Truyện hay quá! Hóng chương tiếp theo ạ!',
    'Cốt truyện rất cuốn hút, nhân vật được xây dựng tốt.',
    'Tác giả viết rất hay, cảm ơn tác giả!',
    'Đoạn này hấp dẫn quá, không thể ngừng đọc!',
    'Chờ update chương mới mỗi ngày luôn!',
    'Nhân vật chính quá ngầu, fan cứng đây!',
    'Plot twist bất ngờ quá, không đoán được!',
    'Viết hay lắm, 5 sao không thể thiếu!',
    'Recommend cho mọi người đọc nhé!',
    'Thêm chương đi tác giả ơi, đọc một lúc là hết rồi!',
  ];

  const comments = [];
  for (let i = 0; i < 25; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
    
    const comment = await prisma.comment.create({
      data: {
        userId: randomUser.id,
        storyId: randomStory.id,
        content: randomText,
      },
    });
    comments.push(comment);
  }

  // Create some chapter comments
  for (let i = 0; i < 15; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
    const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
    
    const comment = await prisma.comment.create({
      data: {
        userId: randomUser.id,
        chapterId: randomChapter.id,
        content: `[Chương ${randomChapter.number}] ${randomText}`,
      },
    });
    comments.push(comment);
  }

  console.log('✅ Sample comments created:', comments.length);

  // Create sample bookmarks
  const bookmarks = [];
  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    const user = users[userIndex];
    // Each user bookmarks 2-4 random stories
    const bookmarkCount = Math.floor(Math.random() * 3) + 2;
    const shuffledStories = [...stories].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < bookmarkCount; i++) {
      if (i < shuffledStories.length) {
        try {
          const bookmark = await prisma.bookmark.create({
            data: {
              userId: user.id,
              storyId: shuffledStories[i].id,
            },
          });
          bookmarks.push(bookmark);
        } catch (error) {
          // Skip if bookmark already exists
        }
      }
    }
  }

  console.log('✅ Sample bookmarks created:', bookmarks.length);

  // Create sample ratings
  const ratings = [];
  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    const randomRating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
    const ratingTexts = [
      'Truyện xuất sắc! Đáng đọc!',
      'Rất hay, recommend cho mọi người!',
      'Cốt truyện hấp dẫn, nhân vật sinh động!',
      'Tác giả viết rất tài tình!',
      '10/10 điểm, không có gì để chê!',
    ];
    
    try {
      const rating = await prisma.rating.create({
        data: {
          userId: randomUser.id,
          storyId: randomStory.id,
          rating: randomRating,
          review: ratingTexts[Math.floor(Math.random() * ratingTexts.length)],
        },
      });
      ratings.push(rating);
    } catch (error) {
      // Skip if rating already exists for this user-story pair
    }
  }

  console.log('✅ Sample ratings created:', ratings.length);

  // Create sample ads
  const ads = await Promise.all([
    prisma.ad.create({
      data: {
        title: 'Popup Quảng Cáo Mỗi 2 Chương',
        type: AdType.POPUP,
        position: AdPosition.BOTTOM,
        content: `<div class="ad-popup bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-2">🎉 Khuyến mãi đặc biệt!</h3>
          <p class="mb-4">Đăng ký Premium để đọc không giới hạn + không quảng cáo</p>
          <button class="bg-white text-purple-600 px-4 py-2 rounded font-semibold hover:bg-gray-100">
            Nâng cấp ngay
          </button>
        </div>`,
        linkUrl: '/premium',
        triggerRule: JSON.stringify({
          chaptersRead: 2,
          frequency: 'every',
          description: 'Hiển thị popup sau mỗi 2 chương đọc'
        }),
        isActive: true,
        impressionCount: 1250,
        clickCount: 89,
      },
    }),
    prisma.ad.create({
      data: {
        title: 'Banner Top Website',
        type: AdType.BANNER,
        position: AdPosition.TOP,
        content: `<div class="banner-ad bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center py-3">
          <div class="container mx-auto">
            <span class="text-sm font-medium">🔥 BLACK FRIDAY: Giảm 50% gói Premium - Chỉ còn 3 ngày!</span>
            <a href="/premium" class="ml-4 bg-white text-blue-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100">
              Mua ngay
            </a>
          </div>
        </div>`,
        linkUrl: '/premium',
        isActive: true,
        impressionCount: 5420,
        clickCount: 243,
      },
    }),
    prisma.ad.create({
      data: {
        title: 'Popup Sau 5 Chương - Đăng Ký',
        type: AdType.POPUP,
        position: AdPosition.BOTTOM,
        content: `<div class="ad-popup bg-white border-2 border-gray-200 p-6 rounded-lg shadow-xl">
          <h3 class="text-lg font-bold text-gray-800 mb-2">📚 Bạn đã đọc 5 chương!</h3>
          <p class="text-gray-600 mb-4">Đăng ký tài khoản để lưu tiến độ đọc và bookmark truyện yêu thích</p>
          <div class="flex space-x-2">
            <button class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Đăng ký
            </button>
            <button class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
              Để sau
            </button>
          </div>
        </div>`,
        linkUrl: '/auth/register',
        triggerRule: JSON.stringify({
          chaptersRead: 5,
          frequency: 'after',
          userType: 'guest',
          description: 'Hiển thị cho khách chưa đăng ký sau 5 chương'
        }),
        isActive: true,
        impressionCount: 892,
        clickCount: 156,
      },
    }),
    prisma.ad.create({
      data: {
        title: 'Native Ad - Truyện Đề Xuất',
        type: AdType.NATIVE,
        position: AdPosition.INLINE,
        content: `<div class="native-ad border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div class="text-xs text-gray-500 mb-2">Quảng cáo</div>
          <div class="flex items-center space-x-3">
            <img src="https://placehold.co/60x80/f97316/white?text=AD" alt="Ad Story" class="rounded">
            <div>
              <h4 class="font-semibold text-gray-800">Truyện Hay Cho Bạn</h4>
              <p class="text-sm text-gray-600">Khám phá những câu chuyện hấp dẫn nhất...</p>
              <span class="text-xs text-purple-600">Xem ngay →</span>
            </div>
          </div>
        </div>`,
        linkUrl: '/truyen-hay',
        isActive: true,
        impressionCount: 2341,
        clickCount: 187,
      },
    }),
  ]);

  console.log('✅ Sample ads created:', ads.length);

  // Create sample read progress
  const readProgresses = [];
  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    const user = users[userIndex];
    // Each user has read progress for 1-3 stories
    const progressCount = Math.floor(Math.random() * 3) + 1;
    const shuffledStories = [...stories].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < progressCount; i++) {
      if (i < shuffledStories.length) {
        const story = shuffledStories[i];
        const storyChapters = chapters.filter(c => c.storyId === story.id);
        
        if (storyChapters.length > 0) {
          const randomChapter = storyChapters[Math.floor(Math.random() * storyChapters.length)];
          const randomProgress = Math.floor(Math.random() * 100) + 1;
          
          try {
            const readProgress = await prisma.readProgress.create({
              data: {
                userId: user.id,
                storyId: story.id,
                chapterId: randomChapter.id,
                progress: randomProgress,
              },
            });
            readProgresses.push(readProgress);
          } catch (error) {
            // Skip if read progress already exists for this user-story pair
          }
        }
      }
    }
  }

  console.log('✅ Sample read progress created:', readProgresses.length);

  // Create sample views for analytics
  const views = [];
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Create story views
  for (let i = 0; i < 100; i++) {
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    const randomDate = new Date(oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime()));
    const randomUser = Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)] : null; // 30% guest views
    
    const view = await prisma.view.create({
      data: {
        userId: randomUser?.id,
        storyId: randomStory.id,
        ipAddress: randomUser ? null : `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: randomDate,
      },
    });
    views.push(view);
  }

  // Create chapter views
  for (let i = 0; i < 200; i++) {
    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
    const randomDate = new Date(oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime()));
    const randomUser = Math.random() > 0.2 ? users[Math.floor(Math.random() * users.length)] : null; // 20% guest views
    
    const view = await prisma.view.create({
      data: {
        userId: randomUser?.id,
        chapterId: randomChapter.id,
        ipAddress: randomUser ? null : `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
        createdAt: randomDate,
      },
    });
    views.push(view);
  }

  console.log('✅ Sample views created:', views.length);

  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📋 Summary:');
  console.log(`👤 Users: ${1 + authors.length + users.length} total`);
  console.log(`📚 Stories: ${stories.length}`);
  console.log(`📄 Chapters: ${chapters.length}`);
  console.log(`🏷️ Genres: ${genres.length}`);
  console.log(`💬 Comments: ${comments.length}`);
  console.log(`🔖 Bookmarks: ${bookmarks.length}`);
  console.log(`⭐ Ratings: ${ratings.length}`);
  console.log(`📊 Read Progress: ${readProgresses.length}`);
  console.log(`📺 Ads: ${ads.length}`);
  console.log(`👁️ Views: ${views.length}`);
  console.log('');
  console.log('📋 Default accounts created:');
  console.log('👑 Admin: admin@webtruyen.com / admin123456');
  console.log('✍️ Authors:');
  console.log('   - author1@webtruyen.com / author123456 (Alpentou)');
  console.log('   - author2@webtruyen.com / author123456 (Ngã Cật Tây Hồng Thị)');
  console.log('   - author3@webtruyen.com / author123456 (Thiên Tằm Thổ Đậu)');
  console.log('   - author4@webtruyen.com / author123456 (Đường Gia Tam Thiếu)');
  console.log('👥 Users:');
  console.log('   - user1@example.com / user123456 (DocGiaA)');
  console.log('   - user2@example.com / user123456 (DocGiaB)');
  console.log('   - user3@example.com / user123456 (TruyenFan2024)');
  console.log('');
  console.log('🚀 You can now start the application:');
  console.log('   cd backend && npm run start:dev');
  console.log('   cd frontend && npm run dev');
  console.log('');
  console.log('🔧 Admin Panel: http://localhost:3000/admin');
  console.log('🗄️ Database Studio: cd backend && npx prisma studio');
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
    'Âm mưu trong bóng tối',
    'Sự thật đau lòng',
    'Hy sinh cao cả',
    'Chiến thắng khó khăn',
    'Tình bạn đầy nghĩa',
    'Lời thề trong gió',
    'Khoảnh khắc định mệnh',
    'Chia ly đầy nước mắt',
    'Tái ngộ sau nhiều năm',
    'Hồi kết viên mãn',
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomChapterContent(storyTitle: string, chapterNumber: number): string {
  const contentTemplates = [
    `Trong chương ${chapterNumber} của "${storyTitle}", câu chuyện tiếp tục phát triển một cách hấp dẫn. Nhân vật chính đã phải đối mặt với những thử thách mới, đòi hỏi sự can đảm và trí tuệ để vượt qua.

Không khí trong căn phòng trở nên căng thẳng khi những sự kiện bất ngờ diễn ra. Mọi người đều nín thở chờ đợi những diễn biến tiếp theo, không ai có thể đoán trước được điều gì sẽ xảy ra.

"Chúng ta phải hành động ngay bây giờ," một giọng nói nghiêm nghị vang lên trong im lặng. "Không còn thời gian để do dự nữa."

Ánh mắt quyết tâm hiện rõ trên gương mặt của nhân vật chính. Dù biết rằng con đường phía trước đầy gian nan, nhưng họ đã sẵn sàng đối mặt với mọi khó khăn.

Câu chuyện sẽ tiếp tục trong chương sau...`,

    `Chương ${chapterNumber} mở ra với một cảnh tượng tuyệt đẹp. Ánh bình minh tỏa sáng trên đường chân trời, mang đến hy vọng mới cho cuộc hành trình sắp tới.

Nhân vật chính đứng nhìn ra xa, suy ngẫm về những quyết định quan trọng sắp phải đưa ra. Trong lòng họ, những cảm xúc phức tạp đan xen lẫn nhau - vừa lo lắng, vừa phấn khích.

"Đây chính là lúc để chứng minh bản thân," họ thầm nghĩ, nắm chặt bàn tay thành nắm đấm. "Tôi sẽ không để bất cứ ai thất vọng."

Những người bạn đồng hành cũng tỏ ra quyết tâm không kém. Cùng nhau, họ sẽ viết nên một trang sử mới, đầy ắp những kỷ niệm đáng nhớ.

Cuộc phiêu lưu thực sự bắt đầu từ đây...`,

    `Trong "${storyTitle}" chương ${chapterNumber}, tác giả đã khéo léo xây dựng những tình tiết đầy bất ngờ. Mỗi đoạn văn đều chứa đựng những thông điệp sâu sắc về tình bạn, lòng dũng cảm và ý nghĩa của cuộc sống.

Đối t화trong chương này đặc biệt ấn tượng, thể hiện rõ tính cách và động cơ của từng nhân vật. Độc giả có thể cảm nhận được sự phát triển tự nhiên của cốt truyện.

"Đôi khi, để bảo vệ những gì quan trọng nhất, chúng ta phải đưa ra những lựa chọn khó khăn," nhân vật chính nói với giọng điệu đầy cảm xúc.

Những mâu thuẫn nội tại được khắc họa tinh tế, tạo nên chiều sâu cho câu chuyện. Chương này hứa hẹn sẽ là bước ngoặt quan trọng trong toàn bộ tác phẩm.

Hãy cùng chờ đợi những diễn biến thú vị tiếp theo...`,
  ];

  const selectedTemplate = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
  
  // Add some random additional content
  const additionalParagraphs = [
    `\n\nKhông khí xung quanh dần trở nên yên tĩnh, chỉ còn lại tiếng gió thổi qua những tán lá. Đây là khoảnh khắc mà mọi người đều mong đợi, nhưng cũng là lúc căng thẳng nhất.`,
    
    `\n\nNhững kỷ niệm từ quá khứ bỗng ùa về, khiến nhân vật chính không khỏi xúc động. Họ nhận ra rằng hành trình này không chỉ là để đạt được mục tiêu, mà còn là để tìm hiểu bản thân mình.`,
    
    `\n\nÁnh sáng cuối ngày dần tắt, báo hiệu một ngày mới sắp đến. Với những trải nghiệm quý báu thu được, nhân vật chính cảm thấy mình đã trưởng thành hơn rất nhiều.`,
    
    `\n\nTiếng cười nói vui vẻ của những người bạn vang lên, xóa tan đi mọi lo lắng và căng thẳng. Đây chính là những khoảnh khắc đẹp nhất mà họ sẽ luôn trân trọng.`,
  ];

  const randomAdditional = additionalParagraphs[Math.floor(Math.random() * additionalParagraphs.length)];
  
  return selectedTemplate + randomAdditional + `\n\n(Đây là nội dung demo cho chương ${chapterNumber} của truyện "${storyTitle}")`;
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });