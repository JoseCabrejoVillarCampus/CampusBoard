var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Expose, Transform } from 'class-transformer';
import { IsNumber, MaxLength, IsDefined } from 'class-validator';
export class documentoDTO {
    constructor(ID, documento) {
        this.id_documento = ID;
        this.tipo_documento = documento;
    }
}
__decorate([
    Expose({ name: 'id_documento' }),
    IsNumber(),
    Transform(({ value }) => { if (/^[0-9]+$/.test(value) || value == undefined)
        return Math.floor(value);
    else
        throw { status: 400, message: `El dato id_documento incumple los parametros acordados` }; }, { toClassOnly: true }),
    __metadata("design:type", Number)
], documentoDTO.prototype, "id_documento", void 0);
__decorate([
    Expose({ name: 'tipo_documento' }),
    IsDefined({ message: () => { throw { status: 401, message: `El parametro tipo_documento es obligatorio` }; } }),
    MaxLength(30, { message: () => { throw { status: 401, message: `El parametro tipo_documento no puede pasar os 30 caracteres` }; } }),
    Transform(({ value }) => { if (/^[a-z A-Z áéíóúÁÉÍÓÚñÑüÜ 0-9]+$/.test(value))
        return value;
    else
        throw { status: 400, message: `El dato tipo_categoria incumple los parametros acordados` }; }, { toClassOnly: true }),
    __metadata("design:type", String)
], documentoDTO.prototype, "tipo_documento", void 0);
