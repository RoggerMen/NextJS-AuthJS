//Protege rutas con autenticación usando la función auth como middleware.
// borramos el as middleware que tenia
// ERA ASI export { auth as middleware } from "@/auth"
// PERO NOS SALDRIA ERROR PORQUE NECESITA IMPORTAR LO SIGUIENTE Y YA NO EXPORTAR
// Y IMPORTAMOS ESE "auth" DE EL ARCHIVO "auth.ts" donde sale los metodos signIn, signOut, etc
import { auth } from "@/auth"
import { NextResponse } from "next/server";

// EXPORTAMOS POR DEFECTO LA FUNCION QUE ES EL "auth" 
// Y DENTRO DE ESE "auth" CREAMOS UNA FUNCION ASINCRONA
// DONDE VAMOS A PONER NUESTRA LOGICA EXTRA PARA PROTEGER NUESTRA RUTA
export default auth(async(req) =>{
    // "pathname" va almacenar la ruta a la que se esta intentando ingresar
    // ESO ES LO QUE MANEJA EL "middleware"
    // Y LA OBTENEMOS DE "req.nextUrl.pathname"
    // "pathname" LO QUE CONTIENE ES LA RUTA A LA QUE APUNTAMOS A IR O NAVEGAR
    const pathname = req.nextUrl.pathname;
    // CON ESTOS VEMOS COMO FUNCIONA OSEA COMO NOS DA LA RUTA
    //console.log(pathname);
    // LE COLOCAMOS ESTO PARA QUE TODO FUNCIONE BIEN
    //return NextResponse.next();

    // DECLARAMOS "session" Y OBTENEMOS LA "session" de "next auth"
    const session = await auth();

    // ESTO ES PARA PROTEGER CUANDO YA EL USUARIO ESTA DENTRO DE LA PAGINA DESPUES DE "INICIAR SESION" Y CUANDO EN LA RUTA DEL NAVEGADOR PONGA "/login" O "/register" YA NO LOS PERMITA IR A ESAS PAGINAS PORQUE YA ESTAN DENTRO AUNTENTICADOS Y SOLO PODRIAN VERLO SI "CIERRAN SESION"

    // ACA LE DECIMOS QUE SI LA "session" EXISTE Y LA RUTA EN LA QUE YO ESTOY ACTUALMENTE ES "/login"
    // O SI LA RUTA EN LA QUE YO ESTOY ES "/register"
    // A ESTO LE COLOCAMOS parentesis"()" pathname == "/login" || pathname == "/register"
    // PARA QUE REALICE LA VALIDACION EN CONJUNTA 
    // ENTONCES SI ES ALGUNA DE ESAS 2 Y LA "session" EXISTE
    // YO QUIERO QUE ME REDIRIJAS A UNA NUEVA "url" QUE VA A SER EL INICIO(/) 
    // Y VAS A TOMAR DE REFERENCIA LA "url" QUE VIENE DE LA SOLICITUD DEL async(req)
    if(session && (pathname == "/login" || pathname == "/register")){
        return NextResponse.redirect(new URL("/", req.url));
    }

    // ESTO ES PARA PROTEGER LA RUTA PROTEGIDA CUANDO EL USUARIO AUN NO INICIO SESION Y QUIERE VULNERAR COLOCANDO UNA RUTA QUE SOLO USUARIOS AUTENTICADOS PUEDEN ENTRAR A VER EL CONTENIDO DE ESA PAGINA

    // LE DECIMOS QUE SI LA "session" NO EXISTE Y LA RUTA ES "/protected" 
    if(!session && pathname === "/protected"){
        //QUIERO QUE NO ME DEJES ENTRAR Y QUE LO REDIRIJAS A UNA NUEVA "url" QUE VA A SER "/login"
        return NextResponse.redirect(new URL("/login", req.url));
    } else if (!session && pathname === "/overview/edit"){
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // ESTO ES PARA QUE CONTINUE TODO BIEN
    return NextResponse.next();

});
