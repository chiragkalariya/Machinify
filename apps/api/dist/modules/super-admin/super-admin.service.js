"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database.service");
let SuperAdminService = class SuperAdminService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async findAdmin(email) {
        const result = await this.databaseService.query(`SELECT id, email, password, name FROM admin_users WHERE lower(email) = lower($1) LIMIT 1`, [email]);
        return result.rows[0];
    }
    async authenticate(email, password, otp) {
        const admin = await this.findAdmin(email);
        if (!admin || admin.password !== password) {
            throw new common_1.HttpException('Invalid email or password', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (!/^[0-9]{6}$/.test(otp)) {
            throw new common_1.HttpException('OTP must be a 6-digit code', common_1.HttpStatus.BAD_REQUEST);
        }
        const sessionId = Math.random().toString(36).slice(2);
        await this.databaseService.query(`INSERT INTO sessions (id, user_id, active, created_at, expires_at)
       VALUES ($1, $2, true, $3, $4)`, [sessionId, admin.id, new Date().toISOString(), new Date(Date.now() + 30 * 60 * 1000).toISOString()]);
        await this.databaseService.query(`INSERT INTO activity (user_name, action, time)
       VALUES ($1, $2, $3)`, [admin.name, 'Signed in to super admin portal', new Date().toISOString()]);
        return { user: { email: admin.email, name: admin.name } };
    }
    async getDashboard() {
        const shopsResult = await this.databaseService.query(`SELECT count(*) AS count FROM shops`);
        const sessionsResult = await this.databaseService.query(`SELECT count(*) AS count FROM sessions WHERE active = true`);
        const alertsResult = await this.databaseService.query(`SELECT count(*) AS count FROM alerts`);
        const activityResult = await this.databaseService.query(`SELECT user_name, action, time FROM activity ORDER BY time DESC LIMIT 10`);
        const activeShops = Number(shopsResult.rows[0]?.count ?? 0);
        const adminsOnline = Number(sessionsResult.rows[0]?.count ?? 0);
        const securityAlerts = Number(alertsResult.rows[0]?.count ?? 0);
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
        };
    }
};
exports.SuperAdminService = SuperAdminService;
exports.SuperAdminService = SuperAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], SuperAdminService);
