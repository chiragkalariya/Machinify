import 'reflect-metadata'
import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = Number(process.env.PORT ?? 4001)
  await app.listen(port)
  console.log(`BizFlow API listening on http://127.0.0.1:${port}`)
}

bootstrap()
