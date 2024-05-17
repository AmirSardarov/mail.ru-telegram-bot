require('dotenv').config();
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const TelegramBot = require('node-telegram-bot-api');

// Telegram configuration
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});
const chatId = process.env.TELEGRAM_CHAT_ID;

// IMAP configuration
const imapConfig = {
    host: 'imap.mail.ru',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
};

const mailAccounts = [
    { user: process.env.MAIL_USER1, password: process.env.MAIL_PASS1 },
    { user: process.env.MAIL_USER2, password: process.env.MAIL_PASS2 }
];

// Array to keep track of sent message IDs
let sentMessageIds = [];

// Time when the script started
const scriptStartTime = new Date();

function openInbox(imap) {
    return new Promise((resolve, reject) => {
        imap.openBox('INBOX', true, (err, box) => {
            if (err) reject(err);
            resolve(box);
        });
    });
}

function processMail(imap, userEmail) {
    imap.on('mail', async () => {
        console.log('New mail event detected.');
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: '', markSeen: true };

        imap.search(searchCriteria, (err, results) => {
            if (err) throw err;

            const fetch = imap.fetch(results, fetchOptions);
            fetch.on('message', msg => {
                msg.on('body', async (stream) => {
                    const parsed = await simpleParser(stream);
                    const subject = parsed.subject || 'No Subject';
                    const from = parsed.from.text || 'Unknown sender';
                    const text = parsed.text || 'No content';
                    const messageId = parsed.messageId || 'Unknown ID';
                    const date = parsed.date || new Date();

                    // Only process messages received after the script started
                    if (date > scriptStartTime && !sentMessageIds.includes(messageId)) {
                        console.log('New mail:', subject);

                        const telegramMessage = `Новое сообщение от: "${from}":\n\nТема: ${subject}\n\nСообщение: ${text}\n\nПолучено на: ${userEmail}`;
                        bot.sendMessage(chatId, telegramMessage);

                        // Add the message ID to the list of sent messages
                        sentMessageIds.push(messageId);
                    } else {
                        console.log('Message already sent or old:', subject);
                    }
                });
            });

            fetch.once('end', () => {
                console.log('Done fetching all messages!');
            });
        });
    });
}

function connectAccount(account) {
    const imap = new Imap({
        user: account.user,
        password: account.password,
        ...imapConfig
    });

    imap.once('ready', async () => {
        console.log(`Connected to ${account.user}`);
        await openInbox(imap);
        processMail(imap, account.user);
    });

    imap.once('error', err => {
        console.log(err);
    });

    imap.connect();

    // Set interval for periodic mail check
    setInterval(() => {
        console.log(`Checking mail for ${account.user}...`);
        imap.connect();
    }, 60000); // 60 seconds interval
}

mailAccounts.forEach(connectAccount);

console.log('Telegram Bot Token:', process.env.TELEGRAM_BOT_TOKEN);
console.log('Telegram Chat ID:', process.env.TELEGRAM_CHAT_ID);
