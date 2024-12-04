/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
//NOS VA A SALIR ERROR PERO USAMOS LO QUE NOS DIGA EN EL TRY DE LA INFORMACION DEL ERROR
// QUE ES ESTO POR EJEMPLO : npm i --save-dev @types/bcryptjs
// QUE SIRVE PARA QUE TYPESCRIPT RECONOZCA LOS TIPOS DE ESA BIBLIOTECA PORQUE NO LAS ESTA RECONOCIENDO
//ENTONCES COLOCAMOS ESTO npm i --save-dev @types/bcryptjs EN CONSOLA DE AHI RECONOCE LOS TIPOS Y YA NO NOS MUESTRA EL ERROR EN 'bcryptjs'
// USAMOS ESTO PARA CIFRAR LA CONTRASEÑA
//import bcrypt from 'bcryptjs';

export const POST = async (req: NextRequest) =>{
    // EN req.json() vamos a estar recibiendo un objeto que va a contener todos nuestros datos que veremos que nos llegue
    // ENTONCES con {username, email, passwor} decimos que quiero que me llegue cada uno de ellos
    const{username, email, password} = await req.json();

    // ESTE TRY CATCH ES POR SI ALGO SALE MAL EN EL PROCESO EL ERROR VA A SER CAPTURADO POR EL CATCH Y QUE NOS LO DEVUELVA
    try {
        // UNA VES NOS LLEGUEN ESOS DATOS VALIDAMOS SI EL USUARIO EXISTE Y SI EXISTE DEVOLVER UN ERROR
    // SI NO EXISTE LO CREAMOS Y DEVOLVER UN MENSAJE DE EXITO 
    // PARA ESO NECESITAMOS USAR "prisma"

    // AQUI VALIDAMOS SI EL NOMBRE DE USUARIO EXISTE
    // llamamos a la instancia que hemos creado del prisma 
    // usamos user para hacer las consultas, user es la tabla donde esta en nuestra base de datos que creamos con prisma
    //BUSCAMOS UN DATO UNICO CON findUnique
    const usernameExists = await prisma.user.findUnique({where: {username}});

    const emailExists = await prisma.user.findUnique({where: {email}});

    // aca le decimos si el nombre de usuario ya existe me vas a devolver una respuesta al navegador que va a ser un ERROR con mensaje
    if(usernameExists){
        return NextResponse.json({error: "El usuario ya existe"});
    // Y SI POR ALGUNA RAZON EL "email" TAMBIEN EXISTE ME VAS A DEVOLVER TAMBIEN UN ERROR CON MENSAJE
    } else if (emailExists){
        return NextResponse.json({error: "El correo ya existe"});
    } // DESPUES DE QUE ESTA VALIDACION SALGA BIEN Y NO MANDE EL ERROR VAMOS A CREAR AL USUARIO
    
    // USAMOS LA BIBLIOTECA 'bcryptjs' PARA HASHEAR(hashed) LA CONTRASEÑA Y CIFRARLA
    // COMO ES UN METODO ASINCRONO EL bcrypt USAMOS "await"
    // DONDE LLAMAMOS A "bcrypt" y llamamos al metodo "hash" 
    // Y LE VAMOS A PASAR LO QUE QUEREMOS CIFRAR Y CUANTOS SALTOS LO QUEREMOS CIFRAR
    
    //const passwordHashed = await bcrypt.hash(password,12)


    // CREAMOS AL USUARIO CON EL METODO "create" de prisma PARA CREAR AL USUARIO
    // Y LE PASAMOS LOS DATOS
    const user = await prisma.user.create({
        data:{
            username,
            email,
            password//: passwordHashed, // ENcriptamos la contraseña con bcrypt, la contraseña hasheada PARA UNA CAPA EXTRA DE SEGURIDAD
        },
    });
    // UNA VEZ QUE TODO SALGA BIEN(CREAR USUARIO)
    // VAMOS A RETORNAR EL RESULTADO CON UN "okey:true" CON UN MENSAJE
    // Y LE MANDAMOS UN CODIGO DE ESTADO QUE ES DE 200
    return NextResponse.json({ok: true, message:"Usuario registrado exitosamente"},
        {status: 200}
    );
    //ACA CAPTURAMOS EL ERROR
    // Y DEVOLVEMOS EL RESULTADO DEL ERROR CON UN STATUS DE 500
    } catch (error) {
        console.error(error);  // AQUI IMPRIMIMOS EL ERROR EN CONSOLA PARA QUE SEA MAS SENCILLO DEBUGUEARLO
        return NextResponse.json({error:"Error interno del Servidor"},{status: 500});
    }
};
// CON TODO ESTO YA TENDRIAMOS LO QUE ES LA RUTA DEL "api" PARA REGISTRAR USUARIOS
