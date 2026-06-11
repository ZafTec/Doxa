import {Body, Controller, Get, Param, Post, UsePipes} from '@nestjs/common';
import {AssetService} from "./asset.service";
import {ZodValidationPipe} from "nestjs-zod";
import {type CreateAssetDto, createAssetSchema} from "./asset.schema";

@Controller('asset')
export class AssetController {

    constructor(private readonly assetService: AssetService) {}

    @Post("/create")
    async createAsset(@Body(new ZodValidationPipe(createAssetSchema)) asset: CreateAssetDto) {
        await this.assetService.createAsset(asset);
        return {
            message: "Assets Added"
        }
    }

    @Get('/:id')
    async getAssetByItemVariantId(@Param('id') id: string): Promise<String[]> {
        return this.assetService.fetchAssetByItemVariantId(id)
    }

}
