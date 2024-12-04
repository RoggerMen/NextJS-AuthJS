import React from 'react';
import AuthForm from '../_components/AuthForm/form';

const Page = () => {
    return (
      <main>
        <section className='min-h-screen flex items-center justify-center'>
            {/*  RECIBIMOS LOS DATOS POR MEDIO DEL COMPONENTE DEL ARCHIVO form.tsx */}
          <AuthForm mode='login' /> 
        </section>
      </main>
    )
  }

export default Page