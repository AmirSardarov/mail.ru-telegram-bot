# Email to Telegram Bot

Этот скрипт позволяет отслеживать новые письма на нескольких почтовых аккаунтах и отправлять уведомления в Telegram. Скрипт использует IMAP для проверки новых писем и Telegram Bot API для отправки уведомлений.

## Требования

- Node.js и npm
- Зарегистрированный бот в Telegram
- Почтовые аккаунты, поддерживающие IMAP

## Установка

1. Склонируйте репозиторий и перейдите в его директорию:

   ```bash
   git clone https://github.com/AmirSardarov/mail.ru-telegram-bot.git
   cd mail.ru-telegram-bot/mail-watcher/config

2. Создайте в корне проекта файл .env

3. Скопируйте и вставьте в него:
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_CHAT_ID=ваш_chat_id
MAIL_USER1=ваш_email_1
MAIL_PASS1=ваш_пароль_1
MAIL_USER2=ваш_email_2
MAIL_PASS2=ваш_пароль_2
тут пароли создавайте для аккаунтов
https://help.mail.ru/mail/security/protection/external/#create
4. В Терминале введите команды:
npm install и далее node index.js

PS ЧТОБЫ ДОБАВИТЬ БОЛЬШЕ ЮЗЕРОВ БОЛЕЕ ДВУХ:
 В файле index.js добавляет нового пользователя в массив mailAccounts:
Ищите строки и по аналогии добавляем 3го юзера.
const mailAccounts = [
    { user: process.env.MAIL_USER1, password: process.env.MAIL_PASS1 },
    { user: process.env.MAIL_USER2, password: process.env.MAIL_PASS2 },
    { user: process.env.MAIL_USER3, password: process.env.MAIL_PASS3 }  // Новый пользователь
];