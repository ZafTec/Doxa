import {Controller, Get} from '@nestjs/common';
import {ItemService} from "./item.service";

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {
    }

    @Get()
    async getAll() {
        return this.itemService.getAll()
    }
}
