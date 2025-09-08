import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { UserRole, StoryStatus } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('stats/users')
  async getUsersStats() {
    return this.adminService.getUsersStats();
  }

  @Get('stats/stories')
  async getStoriesStats() {
    return this.adminService.getStoriesStats();
  }

  @Get('users')
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllUsers(
      page ? +page : 1,
      limit ? +limit : 20,
      role,
      search,
    );
  }

  @Put('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: UserRole },
  ) {
    return this.adminService.updateUserRole(+id, body.role);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(+id);
  }

  @Get('stories')
  async getAllStories(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: StoryStatus,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllStories(
      page ? +page : 1,
      limit ? +limit : 20,
      status,
      search,
    );
  }

  @Put('stories/:id/status')
  async updateStoryStatus(
    @Param('id') id: string,
    @Body() body: { status: StoryStatus },
  ) {
    return this.adminService.updateStoryStatus(+id, body.status);
  }

  @Delete('stories/:id')
  async deleteStory(@Param('id') id: string) {
    return this.adminService.deleteStory(+id);
  }

  @Get('health')
  async getSystemHealth() {
    return this.adminService.getSystemHealth();
  }
}