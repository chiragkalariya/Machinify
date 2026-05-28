import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { DatabaseService } from '../../database.service'

type AdminUser = {
  id: number
  email: string
  password: string
  name: string
}

type ActivityEntry = {
  user_name: string
  action: string
  time: string
}

@Injectable()
export class SuperAdminService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async findAdmin(email: string) {
    const result = await this.databaseService.query<AdminUser>(
      `SELECT id, email, password, name FROM admin_users WHERE lower(email) = lower($1) LIMIT 1`,
      [email],
    )
    return result.rows[0]
  }

  async authenticate(email: string, password: string, otp: string) {
    const admin = await this.findAdmin(email)
    if (!admin || admin.password !== password) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED)
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      throw new HttpException('OTP must be a 6-digit code', HttpStatus.BAD_REQUEST)
    }

    const sessionId = Math.random().toString(36).slice(2)
    await this.databaseService.query(
      `INSERT INTO sessions (id, user_id, active, created_at, expires_at)
       VALUES ($1, $2, true, $3, $4)`,
      [sessionId, admin.id, new Date().toISOString(), new Date(Date.now() + 30 * 60 * 1000).toISOString()],
    )

    await this.databaseService.query(
      `INSERT INTO activity (user_name, action, time)
       VALUES ($1, $2, $3)`,
      [admin.name, 'Signed in to super admin portal', new Date().toISOString()],
    )

    return { user: { email: admin.email, name: admin.name } }
  }

  async getDashboard() {
    const shopsResult = await this.databaseService.query<{ count: string }>(
      `SELECT count(*) AS count FROM shops`,
    )
    const sessionsResult = await this.databaseService.query<{ count: string }>(
      `SELECT count(*) AS count FROM sessions WHERE active = true`,
    )
    const alertsResult = await this.databaseService.query<{ count: string }>(
      `SELECT count(*) AS count FROM alerts`,
    )
    const activityResult = await this.databaseService.query<ActivityEntry>(
      `SELECT user_name, action, time FROM activity ORDER BY time DESC LIMIT 10`,
    )

    const activeShops = Number(shopsResult.rows[0]?.count ?? 0)
    const adminsOnline = Number(sessionsResult.rows[0]?.count ?? 0)
    const securityAlerts = Number(alertsResult.rows[0]?.count ?? 0)

    return {
      metrics: [
        {
          label: 'Active shops',
          value: `${activeShops}`,
          detail: `${activeShops} registered shop${activeShops === 1 ? '' : 's'}`,
        },
        {
          label: 'Admins online',
          value: `${adminsOnline}`,
          detail: `${adminsOnline} active session${adminsOnline === 1 ? '' : 's'}`,
        },
        {
          label: 'Security alerts',
          value: `${securityAlerts}`,
          detail: `${securityAlerts} alert${securityAlerts === 1 ? '' : 's'} pending review`,
        },
        {
          label: 'System uptime',
          value: '99.98%',
          detail: 'Last 30 days',
        },
      ],
      activity: activityResult.rows,
    }
  }
}
