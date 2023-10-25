# GooseTrack Backend

Welcome to the GooseTrack backend API! This API delivers robust capabilities for the organization and retrieval of tasks and reviews, enabling you to easily optimize your workflow.

## Description

The GooseTrack backend API provides an extensive array of functionalities for assisting you in staying well-organized and monitoring your tasks and reviews. Using this API, you can:

Create new tasks
Update existing tasks
Retrieve tasks
Delete tasks
Access all your valuable reviews
Create and update reviews
Maintain control by removing unwanted reviews
Certain endpoints necessitate authentication to ensure the security and confidentiality of your data. Our API uses JSON Web Tokens (JWT) as the authentication mechanism, ensuring a robust and dependable authentication process.

## Swagger

For comprehensive documentation covering the API endpoints, request and response formats, as well as authentication prerequisites, please consult the included Swagger specification file, swagger.json.
<a href='https://final-project-backend-6uyr.onrender.com/api/docs'>Swagger documentation</a>

## For Use you need:

1. Clone This repository to your local machine.
2. Install dependencies using $ npm install.
3. Create .env file and add your environment variables:

   - DB_HOST: your MongoDB connection string;
   - PORT: port of this program;
   - JWT_SECRET: secret string for signing reset token;

   - CLOUDINARY_CLOUD_NAME: cloudinary api name;
   - CLOUDINARY_API_KAY: cloudinary api key;
   - CLOUDINARY_API_SECRET: cloudinary api secret;
   - CLOUDINARY_URL_CLOUDINARY_URL: cloudinary URL;

   - META_PASSWORD: password email service;
   - META_EMAIL: user email service;

   - BASE_URL: URL Front End part.

   - SECRET_CRITERIA: criteria to secure google authentication;
   - SECRET_REFERENCE: criteria's reference;

4. Start using:

   - $ npm run start:dev - start the server in development mode;
   - $ npm start - start the server in production mode.

   <a href='https://github.com/OleksiiVTS/final-project-frontend'>FrontEnd Repository</a>
