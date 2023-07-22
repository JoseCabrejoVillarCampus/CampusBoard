import session from 'express-session';
import mysql from 'mysql2';
import {Router} from 'express';
import { SignJWT, jwtVerify } from 'jose';
import proxyProyecto from '../middleware/proyectomiddleware.js';
const storageProyecto = Router();
let con = undefined;

storageProyecto.use(session({
    secret: 'mi-secreto',
    resave: false, 
    saveUninitialized: true,   
}));

storageProyecto.use("/:id?", async (req, res, next) => {
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

storageProyecto.use((req, res, next) => {
    let myConfig = JSON.parse(process.env.MY_CONNECT);
    con = mysql.createPool(myConfig)
    next();
})

storageProyecto.get("/:id?", proxyProyecto, async (req,res)=>{
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
        ? [`SELECT id_proyecto, nombre_proyecto, tiempo_inicio_proyecto, tiempo_entrega_proyecto,
        estado.tipo_estado AS estado_proyecto
        FROM proyecto 
        INNER JOIN estado  ON estado_proyecto = estado.id_estado WHERE id_proyecto = ?`, jwtData.payload.id] 
        : [`SELECT id_proyecto, nombre_proyecto, tiempo_inicio_proyecto, tiempo_entrega_proyecto,
        estado.tipo_estado AS estado_proyecto
        FROM proyecto 
        INNER JOIN estado  ON estado_proyecto = estado.id_estado;`];
    con.query(...sql,
        (err, data, fie)=>{
            res.send(data);
        }
    );
})
storageProyecto.post("/", proxyProyecto ,async (req, res) => {
    con.query(
        /*sql*/
        `INSERT INTO proyecto SET ?`,
        await getBody(req),
        (err, result) => {
            if (err) {
                console.error('Error al crear proyecto:', err.message);
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        }
    );
});
storageProyecto.put("/:id", proxyProyecto ,(req, res) => {
    con.query(
        /*sql*/
        `UPDATE proyecto SET ?  WHERE id_proyecto = ?`,
        [req.body, req.params.id],
        (err, result) => {id_tarea
            if (err) {
                console.error('Error al actualizar proyecto:', err.message);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        }
    );
});
storageProyecto.delete("/:id",(req, res) => {
    con.query(
        /*sql*/
        `DELETE FROM proyecto WHERE id_proyecto = ?`,
        [req.params.id],
        (err, result) => {
            if (err) {
                console.error('Error al eliminar tareas:', err.message);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        }
    );
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
export default storageProyecto;