const TelegramApi = require('node-telegram-bot-api')
const token = '7395374146:AAEmIEz7IF7LeS26adOK5FIeloS5RZ2WwxA'
const bot = new TelegramApi(token, { polling: true })

const chats = {}
const {gameOptions, againOptions} = require('./options')


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен будешь угадать её`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions)
}

const start = () => {

    bot.setMyCommands([
        { command: '/start_bp_bot', description: 'Что умеет бот' },
        { command: '/help_bp_bot', description: 'Команды' },
        { command: '/game_bp_bot', description: 'Игра будет потом' },
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start_bp_bot' || text === '/start_bp_bot@BirdPlansModeratedBot') {
            await bot.sendAnimation(chatId, 'CAACAgIAAxkBAAEKid1nSgn2e4TQ3ff_5SqYgByyJxapGwACv0EAAs16eEgItvvf9JCCwDYE')
            return bot.sendMessage(chatId, `Дата создания бота: 29.11.2024`)
        }

        if (text === '/help_bp_bot' || text === '/help_bp_bot@BirdPlansModeratedBot') {
            return bot.sendMessage(chatId, `Все команды бота:`)
        }

        if (text === '/game_bp_bot' || text === '/game_bp_bot@BirdPlansModeratedBot') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, `${msg.from.first_name}, я тебя не понимаю, напиши /start_bp_bot`)

    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const name = msg.from.first_name;
        if (data === '/again') {
            return startGame(chatId)
        }

        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю ${name}, ты угадал! Это цифра ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожелению ${name}, ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })

}

start()