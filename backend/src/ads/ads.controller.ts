import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdDto, UpdateAdDto, AdTriggerContextDto } from './dto';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() createAdDto: CreateAdDto) {
    return this.adsService.createAd(createAdDto); // Sửa từ create -> createAd
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.adsService.findAll();
  }

  @Get('trigger')
  findForTrigger(@Query() context: AdTriggerContextDto) {
    return this.adsService.getTriggeredAds(context); // Sửa từ findForTrigger -> getTriggeredAds
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    return this.adsService.updateAd(+id, updateAdDto); // Sửa từ update -> updateAd
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adsService.deleteAd(+id);
  }
}
