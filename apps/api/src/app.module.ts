import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';

@Module({
  imports: [SuperAdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
