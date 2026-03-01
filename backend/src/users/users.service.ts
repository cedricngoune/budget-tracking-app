import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

const MAX_PROFILES = 8;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} introuvable`);
    return user;
  }

  async create(dto: CreateUserDto) {
    const count = await this.prisma.user.count();
    if (count >= MAX_PROFILES) {
      throw new BadRequestException(`Maximum ${MAX_PROFILES} profils atteint`);
    }
    return this.prisma.user.create({
      data: {
        name:  dto.name,
        color: dto.color,
        banks: dto.banks ?? [],
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
  }
}