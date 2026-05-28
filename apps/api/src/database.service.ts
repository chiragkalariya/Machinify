import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Pool, QueryResult, QueryResultRow } from 'pg'

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool

  constructor() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL is required for database access')
    }

    this.pool = new Pool({ connectionString })
  }

  async onModuleInit() {
    await this.ensureSchema()
  }

  async onModuleDestroy() {
    await this.pool.end()
  }

  async query<T extends QueryResultRow = any>(text: string, params: any[] = []): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params)
  }

  private async ensureSchema() {
    await this.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS shops (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        message TEXT NOT NULL,
        level TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL
      );

      CREATE TABLE IF NOT EXISTS activity (
        id SERIAL PRIMARY KEY,
        user_name TEXT NOT NULL,
        action TEXT NOT NULL,
        time TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    const result = await this.query<{ count: string }>(`SELECT count(*) FROM admin_users`)
    const count = Number(result.rows[0]?.count ?? 0)
    if (count === 0) {
      await this.query(`
        INSERT INTO admin_users (email, password, name)
        VALUES ($1, $2, $3)
      `, ['admin@shopelite.com', 'admin123', 'Super Admin'])
    }
  }
}
