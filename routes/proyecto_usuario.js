import session from 'express-session';
import mysql from 'mysql2';
import {Router} from 'express';
import { SignJWT, jwtVerify } from 'jose';
import proxyProyectoUsuario from '../middleware/proyecto_usuariomiddleware.js'; 
const storageProyectoUsuario = Router();
let con = undefined;

storageProyectoUsuario.use(session({
    secret: 'mi-secreto',
    resave: false, 
    saveUninitialized: true,   
}));
storageProyectoUsuario.use("/:id?", async (req, res, next) => {
    try {  
        const encoder = new TextEncoder();
        const payload = { body: req.body, params: req.params, id: req.params.id  };
        const jwtconstructor = new SignJWT(payload);
        const jwt = await jwtconstructor 
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(encoder.encode(process.env.JWT_PRIVATE_KEY)); 
        req.body = payload.body;
        req.session.jwt = jwt;
        const maxAgeInSeconds = 3600;
        res.cookie('token', jwt, { httpOnly: true, maxAge: maxAgeInSeconds * 1000 });
        next();  
    } catch (err) { 
        console.error('Error al generar el JWT:', err.message);
        res.sendStatus(500); 
    }
});
storageProyectoUsuario.use((req, res, next) => {
    let myConfig = JSON.parse(process.env.MY_CONNECT);
    con = mysql.createPool(myConfig)
    next();
})
storageProyectoUsuario.get("/:id?", proxyProyectoUsuario , async (req,res)=>{
    const jwt = req.session.jwt; 
    const encoder = new TextEncoder();  
    const jwtData = await jwtVerify(
        jwt,
        encoder.encode(process.env.JWT_PRIVATE_KEY)
    )
    if (jwtData.payload.id && jwtData.payload.id !== req.params.id) {
        return res.sendStatus(403);
    }
    let sql = (jwtData.payload.id)
        ? [`SELECT 
        pu.id_proyecto_usuario,
        p.nombre_proyecto AS nombre_proyecto,
        u.nombre_completo_usuario AS nombre_usuario
    FROM proyecto_usuario pu
    INNER JOIN proyecto p ON pu.id_proyecto = p.id_proyecto
    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario WHERE id_proyecto_usuario = ?`, jwtData.payload.id] 
        : [`SELECT 
        pu.id_proyecto_usuario,
        p.nombre_proyecto AS nombre_proyecto,
        u.nombre_completo_usuario AS nombre_usuario
    FROM proyecto_usuario pu
    INNER JOIN proyecto p ON pu.id_proyecto = p.id_proyecto
    INNER JOIN usuario u ON pu.id_usuario = u.id_usuario;`];
    con.query(...sql,
        (err, data, fie)=>{
            res.send(data);
        }
    );
})
storageProyectoUsuario.post("/", proxyProyectoUsuario ,async (req, res) => {
    con.query(
        /*sql*/
        `INSERT INTO proyecto_usuario SET ?`,
        await getBody(req),
        (err, result) => {
            if (err) {
                console.error('Error al crear proyecto_usuario:', err.message);
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        }
    );
});
storageProyectoUsuario.put("/:id", proxyProyectoUsuario ,async (req, res) => {
    const jwt = req.session.jwt; 
    const encoder = new TextEncoder();  
    const jwtData = await jwtVerify(
        jwt,
        encoder.encode(process.env.JWT_PRIVATE_KEY)
    ) 
    con.query(`UPDATE proyecto_usuario SET ? WHERE id_proyecto_usuario = ?`, [jwtData.payload.body, jwtData.payload.params.id], 
        (err, result) => { 
            if (err) {
                console.error('Error al actualizar proyecto_usuario:', err.message);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        }
    );
});
storageProyectoUsuario.delete("/:id",async (req, res) => {
    const jwt = req.session.jwt; 
    const encoder = new TextEncoder();  
    const jwtData = await jwtVerify(
        jwt,
        encoder.encode(process.env.JWT_PRIVATE_KEY)
    )
    con.query(`DELETE FROM proyecto_usuario WHERE id_proyecto_usuario = ?`, jwtData.payload.params.id, 
        (err,info)=>{
        if(err) {
            console.error(`error eliminando proyecto_usuario ${req.params.id}: `, err.message);
            res.status(err.status)
        } else {
            res.send(info);
        }
    })
});
const getBody = async (req) =>{
    const jwt = req.session.jwt; 
    const encoder = new TextEncoder();  
    const jwtData = await jwtVerify( 
        jwt,
        encoder.encode(process.env.JWT_PRIVATE_KEY)
    );
    delete jwtData.payload.iat;
    delete jwtData.payload.exp;   
    return jwtData.payload.body 
}
export default storageProyectoUsuario; 