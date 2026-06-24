import {Controller, Get, Param, Query, Res} from '@nestjs/common';
import {AdminService} from "./admin.service";
import { type Response } from 'express';
import * as process from "node:process";
import {getAdminAccessTokenQuery, type GetAdminAccessTokenQueryDto} from "./admin.schema";
import {ZodValidationPipe} from "nestjs-zod";
import {getGoogleUser} from "../shared/googleAuth";


@Controller('oauth')
export class AdminController {

    constructor(private readonly adminService: AdminService) {
    }

    @Get()
    async webHook(@Query(new ZodValidationPipe(getAdminAccessTokenQuery)) query: GetAdminAccessTokenQueryDto, @Res() res: Response ) {
        const payload = await this.adminService.validateUser(query.code)
        if (payload) {
            res.cookie('doxa_access_token', payload, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
            });

            return res.redirect('http://localhost:3001/admin');
        }
        return res.redirect('http://localhost:3001/failed');
    }

    @Get("/:loginMethod")
    async findUrl(@Param('loginMethod') loginMethod: string) {
        return this.adminService.redirectUrl(loginMethod)
    }
}
