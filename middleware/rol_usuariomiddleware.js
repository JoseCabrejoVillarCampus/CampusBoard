import express  from "express";
import 'reflect-metadata';
import { plainToClass } from "class-transformer";
import {rol_usuarioDTO} from "../dtocontroller/rol_usuariodto.js";
import { validate } from "class-validator";
import { jwtVerify } from "jose";

const proxyRolUsuario = express();
proxyRolUsuario.use(async(req,res,next)=>{
    try {
        const jwt = req.cookies.token;

        const encoder = new TextEncoder();
        const jwtData = await jwtVerify(
            jwt,
            encoder.encode(process.env.JWT_PRIVATE_KEY)
        )
        let data = plainToClass(rol_usuarioDTO, jwtData.payload.body, { excludeExtraneousValues: true});
        await validate(data); 
        next();
    } catch (err) {
        const statusCode = err.status || 500;
        const errorMessage = err.message || 'Ha ocurrido un error en el servidor.';
        res.status(statusCode).send(errorMessage);
    }
})
export default proxyRolUsuario;