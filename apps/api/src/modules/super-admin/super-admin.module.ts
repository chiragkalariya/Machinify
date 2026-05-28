import { Module } from '@nestjs/common'
import { SuperAdminController } from './super-admin.controller'
import { SuperAdminService } from './super-admin.service'
import { DatabaseService } from '../../database.service'

@Module({
  controllers: [SuperAdminController],
  providers: [DatabaseService, SuperAdminService],
})
export class SuperAdminModule {}
