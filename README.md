 Proyecto Backend – API REST (UTN)

Este proyecto es una API REST desarrollada en Node.js + Express + TypeScript, conectada a MongoDB y organizada con el patrón MVC.
Incluye autenticación con JWT, rate limit en las rutas de login y register, y validaciones básicas para los productos.
Deploy en Render

La API está online en:

 https://utn-proyecto-backend.onrender.com

 Estructura del proyecto (MVC)
src/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middleware/
 ├── config/
 └── index.ts

 Configuración y ejecución local
1. Instalar dependencias
npm install

2. Crear archivo .env

Ejemplo de variables (ver .env.example incluido):

PORT=
URI_DB=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=

3. Scripts disponibles
Comando	Descripción
npm run dev	Ejecuta el proyecto en TypeScript
npm run build	Compila a JavaScript
npm run start	Ejecuta la versión compilada

 Autenticación
Método	Ruta	Descripción
POST	/auth/register	Crear usuario
POST	/auth/login	Obtener JWT

Las rutas de autenticación tienen rate limit.

 Productos
Método	Ruta	Requiere token	Descripción
GET	/products	No	Listar productos
GET	/products/:id	No	Obtener por ID
POST	/products	Sí	Crear producto
PATCH	/products/:id	Sí	Editar producto
DELETE	/products/:id	Sí	Eliminar producto
Filtros disponibles (query params):

?category=

?name= (búsqueda parcial)

?minPrice=

?maxPrice=

