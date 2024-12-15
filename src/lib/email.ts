import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const data = await resend.emails.send({
      from: 'Your App <onboarding@yourdomain.com>',
      to: email,
      subject: 'Bienvenido a nuestra aplicación',
      html: `
        <h1>Bienvenido, ${name}!</h1>
        <p>Gracias por registrarte en nuestra aplicación. Estamos emocionados de tenerte con nosotros.</p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      `
    });

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

