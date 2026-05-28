import { IsEnum, IsObject, IsNumber, ValidateNested } from 'class-validator'

type SyncAction = 'CREATE_ORDER' | 'UPDATE_ORDER' | 'UPDATE_STOCK' | 'CREATE_INVOICE' | 'CREATE_LEDGER_ENTRY'

export class SyncActionDto {
  @IsEnum(['CREATE_ORDER', 'UPDATE_ORDER', 'UPDATE_STOCK', 'CREATE_INVOICE', 'CREATE_LEDGER_ENTRY'])
  action!: SyncAction

  @IsObject()
  payload!: Record<string, unknown>

  @IsNumber()
  timestamp!: number
}
