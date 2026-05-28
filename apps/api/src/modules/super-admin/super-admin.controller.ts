import { Body, Controller, Get, Post } from '@nestjs/common'
import { SuperAdminService } from './super-admin.service'

@Controller('api/v1/superadmin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('auth/signin')
  async signIn(@Body() body: { email: string; password: string; otp: string }) {
    return this.superAdminService.authenticate(body.email, body.password, body.otp)
  }

  @Get('dashboard')
  async getDashboard() {
    return this.superAdminService.getDashboard()
  }
}
