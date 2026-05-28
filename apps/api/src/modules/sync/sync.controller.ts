import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common'
import { SyncService } from './sync.service'
import { SyncActionDto } from './dto/sync-action.dto'

@Controller('api/v1/sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  // @UseGuards(RolesGuard)
  // @Roles('SHOP_OWNER')
  async syncAction(@Body() dto: SyncActionDto) {
    try {
      const result = await this.syncService.processAction(dto)
      return result
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        { message: 'Sync failed', error: (error as Error).message },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
