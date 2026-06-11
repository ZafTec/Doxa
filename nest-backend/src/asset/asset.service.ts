import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateAssetDto} from "./asset.schema";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class AssetService {

    constructor(private readonly prismaService: PrismaService) {
    }

    async createAsset(asset: CreateAssetDto){
        const {count} = await this.prismaService.asset.createMany({
            data: asset.urls.map(url => ({
                itemVariantId: asset.itemVariantId,
                url
            }))
        })

        if (count !== asset.urls.length){
            throw new InternalServerErrorException("Failed to add all the assets")
        }

    }

    async fetchAssetByItemVariantId(itemVariantId: string){
        const itemVariant = await this.prismaService.itemVariant.findUnique({where:{id:itemVariantId}})
        if (!itemVariant){
            throw new BadRequestException("Invalid ItemVariant ID")
        }
        const assets = await this.prismaService.asset.findMany({
            where: {
                    itemVariantId:itemVariantId
                },
            select: {
                url: true
            }
        })

        return assets.map(asset => asset.url)
    }


}
