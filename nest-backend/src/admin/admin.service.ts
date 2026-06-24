import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import * as process from "node:process";
import {JwtService} from "@nestjs/jwt";
import {getGoogleAccessToken, getGoogleUser} from "../shared/googleAuth";



@Injectable()
export class AdminService {

    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {
    }

    async redirectUrl(loginType: string){
        const clientId = process.env[`${loginType}_CLIENT_ID`]
        return {url:`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=http://localhost:3000/oauth&response_type=code&scope=email`}
    }

    async validateUser(code: string){
        try{
            const accessToken = await getGoogleAccessToken(code)
            const {email} = await getGoogleUser(accessToken)
            const user =  await this.prismaService.user.findUnique({
                where: {
                    email: email
                }
            })

            if (!user) {
                return null
            }

            return await this.jwtService.signAsync(user)

        } catch (err) {
            throw new BadRequestException(err.message);
        }

    }
}
