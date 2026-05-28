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
exports.SyncActionDto = void 0;
const class_validator_1 = require("class-validator");
class SyncActionDto {
}
exports.SyncActionDto = SyncActionDto;
__decorate([
    (0, class_validator_1.IsEnum)(['CREATE_ORDER', 'UPDATE_ORDER', 'UPDATE_STOCK', 'CREATE_INVOICE', 'CREATE_LEDGER_ENTRY']),
    __metadata("design:type", String)
], SyncActionDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SyncActionDto.prototype, "payload", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SyncActionDto.prototype, "timestamp", void 0);
