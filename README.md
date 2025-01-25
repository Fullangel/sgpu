## Getting Started

First, run the development server:

```bash
npm run dev
```

Para el servicio de correo, para que funcione debe seguirse estos pasos:

1. Usar MailHog (Recomendado para desarrollo local)
   Servidor SMTP local que captura todos los emails enviados sin enviarlos realmente.

Pasos:

Descargar MailHog: https://github.com/mailhog/MailHog/releases

Ejecutarlo (se abre en http://localhost:8025)

Configurar .env:

```
EMAIL_USER=no-req
EMAIL_PASSWORD=no-req
EMAIL_FROM=test@localhost
EMAIL_HOST=localhost
EMAIL_PORT=1025
```

2. Usar Ethereal (Buzón temporal online)
   Servicio gratuito que provee un buzón temporal.

Pasos:

Crear cuenta temporal en https://ethereal.email/

Configurar .env con las credenciales generadas:

```
EMAIL_USER=tuusuario@ethereal.email
EMAIL_PASSWORD=passwordgenerado
EMAIL_FROM=tuusuario@ethereal.email
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
```

# En caso de usarse Gmail:

3. Usar Gmail con App Password (Para pruebas reales)
   Si quieres enviar emails reales temporalmente:

Activar verificación en 2 pasos: https://myaccount.google.com/security

Crear App Password: https://myaccount.google.com/apppasswords

Configurar .env:

```
EMAIL_USER=tucorreo@gmail.com
EMAIL_PASSWORD=contraseña_de_aplicación_generada
EMAIL_FROM=tucorreo@gmail.com
```

# Guia de variables de entorno:

```
# Desarrollo Local con MailHog
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_SECURE=false
EMAIL_FROM=no-reply@localhost
# (No necesita usuario/contraseña para MailHog)

# O para Ethereal (generar credenciales en https://ethereal.email):
# EMAIL_HOST=smtp.ethereal.email
# EMAIL_PORT=587
# EMAIL_SECURE=false
# EMAIL_USER=tuusuario@ethereal.email
# EMAIL_PASSWORD=passwordgenerado
# EMAIL_FROM=tuusuario@ethereal.email

```
