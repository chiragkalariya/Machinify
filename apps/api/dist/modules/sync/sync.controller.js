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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncController = void 0;
const common_1 = require("@nestjs/common");
const sync_service_1 = require("./sync.service");
const sync_action_dto_1 = require("./dto/sync-action.dto");
let SyncController = class SyncController {
    constructor(syncService) {
        this.syncService = syncService;
    }
    // @UseGuards(RolesGuard)
    // @Roles('SHOP_OWNER')
    async syncAction(dto) {
        try {
            const result = await this.syncService.processAction(dto);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({ message: 'Sync failed', error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.SyncController = SyncController;
__decorate([
    (0, common_1.Post)()
    // @UseGuards(RolesGuard)
    // @Roles('SHOP_OWNER')
    ,
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sync_action_dto_1.SyncActionDto]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncAction", null);
exports.SyncController = SyncController = __decorate([
    (0, common_1.Controller)('api/v1/sync'),
    __metadata("design:paramtypes", [sync_service_1.SyncService])
], SyncController);
