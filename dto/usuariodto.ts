import { Expose, Type, Transform } from 'class-transformer';
import { IsNumber, IsString, MaxLength, IsDefined } from 'class-validator';

export class usuarioDTO {

    @Expose({ name: 'id_usuario' })
    @IsNumber()
    @Transform(({value})=>{if(/^[0-9]+$/.test(value) || value==undefined ) return Math.floor(value); else throw {status: 400, message:`El dato id_usuario incumple los parametros acordados`};},{ toClassOnly: true})
    ID: number;

    @Expose({ name: 'nombre_usuario' })
    /* @IsDefined({message: ()=>{throw {status: 401, message: `El parametro nombre_usuario es obligatorio` }}})
    @MaxLength(20, {message: ()=>{throw {status: 401, message: `El parametro nombre_usuario no puede pasar os 30 caracteres`}}}) */
    @Transform(({value})=>{if(/^[a-z A-Z áéíóúÁÉÍÓÚñÑüÜ 0-9]+$/.test(value)) return value; else throw {status: 400, message:`El dato tipo_categoria incumple los parametros acordados`};},{ toClassOnly: true})
    nombre: string;

    @Expose({ name: 'apellido_usuario' })
    /* @IsDefined({message: ()=>{throw {status: 401, message: `El parametro apellido_usuario es obligatorio` }}})
    @MaxLength(20, {message: ()=>{throw {status: 401, message: `El parametro apellido_usuario no puede pasar os 30 caracteres`}}}) */
    @Transform(({value})=>{if(/^[a-z A-Z áéíóúÁÉÍÓÚñÑüÜ 0-9]+$/.test(value)) return value; else throw {status: 400, message:`El dato tipo_categoria incumple los parametros acordados`};},{ toClassOnly: true})
    apellido: string;

    @Expose({ name: 'direccion_usuario' })
    /* @IsDefined({message: ()=>{throw {status: 401, message: `El parametro telefono_usuario es obligatorio` }}})
    @MaxLength(15, {message: ()=>{throw {status: 401, message: `El parametro telefono_usuario no puede pasar os 30 caracteres`}}}) */
    @Transform(({value})=>{if(/^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑüÜ\s,.# @]+$/.test(value)) return value; else throw {status: 400, message:`El dato usu_direccion incumple los parametros acordados`};},{ toClassOnly: true})
    direccion: string;

    @Expose({ name: 'edad_usuario' })
    @IsNumber()
    @Transform(({value})=>{if(/^[0-9]+$/.test(value) || value==undefined ) return Math.floor(value); else throw {status: 400, message:`El dato edad_usuario incumple los parametros acordados`};},{ toClassOnly: true})
    edad: number;

    @Expose({ name: 'genero_usuario' })
    @IsNumber()
    @Transform(({value})=>{if(/^[0-9]+$/.test(value) || value==undefined ) return Math.floor(value); else throw {status: 400, message:`El dato genero_usuario incumple los parametros acordados`};},{ toClassOnly: true})
    genero: number;

    @Expose({ name: 'id' })
    @IsNumber()
    @Transform(({value})=>{if(/^[0-9]+$/.test(value) || value==undefined ) return Math.floor(value); else throw {status: 400, message:`El dato id incumple los parametros acordados`};},{ toClassOnly: true})
    ID2: number;

    constructor(
        id_usuario: number,
        nombre_usuario: string,
        apellido_usuario: string,
        direccion_usuario: string,
        edad_usuario: number,
        genero_usuario: number,
        id: number
    ) {
        this.ID = id_usuario;
        this.nombre = nombre_usuario;
        this.apellido = apellido_usuario;
        this.direccion = direccion_usuario;
        this.edad = edad_usuario;
        this.genero = genero_usuario;
        this.ID2 = id;  
    }
} 