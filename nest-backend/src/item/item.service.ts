import {Get, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class ItemService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll(){
        return this.prisma.item.findMany();
    }
}
