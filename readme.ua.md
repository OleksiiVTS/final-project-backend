# GooseTrack Сервер

Ласкаво просимо до API-сервера GooseTrack! Цей API забезпечує надійні можливості для організації та пошуку завдань та оглядів, що дозволяє легко оптимізувати робочий процес.

## Опис

Інтерфейс сервера GooseTrack надає широкий спектр функціональних можливостей для того, щоб допомогти вам залишатися добре організованими та контролювати ваші завдання та огляди. Використовуючи цей API, ви можете:

Створювати нові завдання;
Оновлювати існуючі завдання;
Знаходити завдання;
Видаляти завдання;
Мати доступ до всіх ваших цінних відгуків;
Створювати та оновлювати відгуки;
Зберігайти контроль, видаляючи небажані відгуки.

Певні кінцеві точки вимагають аутентифікації для забезпечення безпеки та конфіденційності ваших даних. Наш API використовує JSON Web Tokens (JWT) як механізм аутентифікації, забезпечуючи стійкий і надійний процес аутентифікації.

## Swagger

Для комплексної документації, що охоплює кінцеві точки API, формати запитів та відповідей, а також передумови аутентифікації, будь ласка, зверніться до включеного файлу специфікації swagger.json.included Swagger specification file, swagger.json.
<a href='https://final-project-backend-6uyr.onrender.com/api/docs'>Swagger документація</a>

## Для використання вам необхідно:

1. Клонувати Цей репозиторій на ваш компютер.
2. Встановити залежності за допомогою команди $ npm install.
3. Створити .env file та додайти змінні середовища:

   - DB_HOST: ваш рядок з'єднання MongoDB;
   - PORT: порт цієї програми;
   - JWT_SECRET: секретний рядок для утворення token;

   - CLOUDINARY_CLOUD_NAME: cloudinary api name;
   - CLOUDINARY_API_KAY: cloudinary api key;
   - CLOUDINARY_API_SECRET: cloudinary api secret;
   - CLOUDINARY_URL_CLOUDINARY_URL: cloudinary URL;

   - META_PASSWORD: пароль поштової скрині;
   - META_EMAIL: пошта, яку використовуватимете для відправки листів;

   - BASE_URL: URL Front End частини.

     - SECRET_CRITERIA: крітерій для захисту google авторізації;
     - SECRET_REFERENCE: значення крітерія;

4. Для початку використання введіть в терміналі:

   - $ npm run start:dev — старт сервера в режимі розробки (development);
   - $ npm start — старт сервера в режимі production.

   <a href='https://github.com/OleksiiVTS/final-project-frontend'>FrontEnd Репозиторій</a>
