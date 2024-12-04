"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(1, { message: "Campo Obligatorio" }),
  email: z
    .string()
    .email({ message: "Email Inválido" })
    .min(1, { message: "Campo Obligatorio" }),
  password: z.string().min(1, { message: "Campo Obligatorio" }),
});

interface Props {
  mode: "login" | "register";
}

const AuthForm = ({ mode }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: mode === "register" ? "" : "a",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (mode === "register") {
        const { data } = await axios.post("/api/users/api/register", values);

        if (data.ok) {
          toast.success(data.message);
        } else if (data.error) {
          toast.error(data.error);
        }
      } else {
        const response = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (response?.error) {
          toast.error("Credenciales no válidas");
        } else if (response?.ok) {
          toast.success("Inicio de sesión exitoso");
          router.push("/");
          router.refresh();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Algo salió mal, vuelve a intentarlo");
    }
  };

  return (
    /*//IMPORTAMOS EL COMPONENTE "form" DE SHADCN */
    <div className='w-full flex items-center justify-center flex-col gap-6'>

        <div className='text-sm font-medium'>
            <Link href={'/'} className='flex items-center gap-0.5 py-1 border-b border-transparent hover:border-b-zinc-950 transition-all duration-300'>
            <ChevronLeft className='w-4 h-4' />
            <span>Volver al Inicio
            </span>
            </Link>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-[380px] px-6 py-6 border border-zinc-300 rounded-md space-y-3 '>


            <h2 className='font-mediun text-lg text-center'> {mode === "register" ? "Registrate":"Inicia Sesión"} </h2>


            <div>
                {/*RENDERIZAMOS TAMBIEN ESTE COMPONENTE DE FORMA CONDICIONAL
                VAMOS A DECIR QUE SI EL "mode" es de "register"
                RENDERIZAMOS ESTO DONDE ENCAPSULAMOS A EL COMPONENTE <FormField /> */}
                {mode === "register" && (
                
                <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Usuario</FormLabel>
                        <FormControl>
                            <Input placeholder="Ejm: RoggerMeneses" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
            )}

                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="ejm: RoggerMeneses@gmail.com" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />

                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="******************" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
            </div>

    <div>
        
        {form.formState.isSubmitting ? <>
        <Button disabled className='w-full'>
            <Loader2 className='w-4 h-4 animate-spin'/>
            <span>{mode === "register" ? "Registrando..." : "Iniciando Sesión..."}</span>
        </Button>
        </> :
        <>
        <div className='flex justify-center items-center'>
<button type="submit" className='w-full bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 py-2 px-4 rounded-lg shadow-lg transition-all w-32'>{mode === "register" ? "Registrar" : "Iniciar Sesión"}</button>
</div> 
        </>}
    </div>


            </form>
        </Form>

        <div className='text-sm'>
            {mode === "register" ? <>
                <p>¿Ya tienes una cuenta? <Link className='font-semibold hover:underline transition-all duration-200' href="/login">Inicia Sesión</Link></p>
                </> 
                : <> <p>¿Aún no tienes una cuenta? <Link className='font-semibold hover:underline transition-all duration-200' href="/register">Registrate</Link></p> </>}
        </div>
    </div>

  )
}

export default AuthForm