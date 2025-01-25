import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // service: 'Gmail', //Solo para produccion
    //Configuracion segun las variables de entorno
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },

    //TODO:Solo para desarrollo (quitar para produccion)
    tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production' //Solo es para verificar en produccion
    }
});

//Verificar la conexion 
transporter.verify()
    .then(() => console.log('✅ Servidor de correo configurado'))
    .catch((error) => {
        console.error('❌ Error configurando correo:');
        console.error('Detalles', error.message);
        if (error.code === 'ECONNECTION') {
            console.error('Verifica tu configuracion de host y port');
        }
    });

export const sendPasswordResetEmail = async (
    email: string,
    token: string,
    question: string
) => {
    if (!email || !token || !question) {
        throw new Error("Parámetros faltantes para el correo");
    }

    // Validar variables de entorno
    if (!process.env.EMAIL_FROM) {
        throw new Error("EMAIL_FROM no configurado");
    }

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2563eb;">Restablecimiento de Contraseña</h2>
        <p style="margin: 15px 0;">Haga clic en el botón para continuar:</p>
        <a href="${resetLink}" 
           style="display: inline-block; 
                  padding: 12px 24px; 
                  background-color: #2563eb; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 5px;
                  margin: 15px 0;">
            Restablecer Contraseña
        </a>
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #2d3748;">Tu pregunta de seguridad:</h3>
            <p style="margin: 0; color: #4a5568;">${question}</p>
        </div>
        <p style="color: #718096; font-size: 0.875rem;">
            ⚠️ Este enlace expirará en 1 hora. Si no solicitaste este cambio, ignora este mensaje.
        </p>
    </div>
    `;

    try {
        await transporter.sendMail({
            from: `Sistema de Gestión <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Restablecimiento de Contraseña',
            html: htmlContent
        });
        console.log(`📧 Correo enviado a: ${email}`);
    } catch (error) {
        console.error('❌ Error enviando correo:');
        console.error('Detalles:', error instanceof Error ? error.message : error);
        throw new Error('Error al enviar el correo de recuperación');
    }
};