import { Expose, Type, Transform } from 'class-transformer';
import { IsNumber, IsString, MaxLength, IsDefined } from 'class-validator';

export class rolDTO {

    @Expose({ name: 'id_rol' })
    @IsNumber()
    @Transform(({value})=>{if(/^[0-9]+$/.test(value) || value==undefined ) return Math.floor(value); else throw {status: 400, message:`El dato id_rol incumple los parametros acordados`};},{ toClassOnly: true})
    id_rol: number;

    @Expose({ name: 'nombre_rol' })
    @IsString()
    /* @IsDefined({message: ()=>{throw {status: 401, message: `El parametro nombre_rol es obligatorio` }}})
    @MaxLength(30, {message: ()=>{throw {status: 401, message: `El parametro nombre_rol no puede pasar os 30 caracteres`}}}) */
    @Transform(({value})=>{if(/^[a-z A-Z áéíóúÁÉÍÓÚñÑüÜ]+$/.test(value)) return value; else throw {status: 400, message:`El dato nombre_rol incumple los parametros acordados`};},{ toClassOnly: true})
    nombre_rol: string;

    @Expose({ name: 'id' })
    @IsNumber()
    @Transform(({value})=>{if(/^[0-9]+$/.test(value) || value==undefined ) return Math.floor(value); else throw {status: 400, message:`El dato id incumple los parametros acordados`};},{ toClassOnly: true})
    id: number;


    constructor(
        ID: number,
        nombre_rol: string,
        ID2: number
    ) { 
        this.id_rol = ID;
        this.nombre_rol = nombre_rol;
        this.id= ID2 
    }
}