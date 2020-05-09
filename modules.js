const Scene = require('node-vk-bot-api/lib/scene');
const Markup = require('node-vk-bot-api/lib/markup');
const Stage = require('node-vk-bot-api/lib/stage');
const User = require('./model');

const mainKeyboard = Markup.keyboard([
    [
        Markup.button('Тест ✌🏻', 'primary'),
        Markup.button('Разыграть друга! 🤡', 'primary'),
    ],
    [
        Markup.button('Баланс 💰', 'primary'),
        Markup.button('Пополнить балланс 💳', 'primary'),
    ]
]);

const mainScene = new Scene('main', ctx => {
        ctx.reply('Главное меню', null, mainKeyboard);
        ctx.scene.next()
    },  ctx => {
        const {body: msg} = ctx.message;
        switch (msg) {
        case 'Тест ✌🏻':
            ctx.scene.enter('test');
            break;
        case 'Разыграть друга! 🤡':
            ctx.reply('Еще не придумал )');
            break;
        case 'Баланс 💰':
            ctx.scene.enter('balance');
            break;
        case 'Пополнить балланс 💳':
            ctx.scene.enter('refilBalance');
            break;
        default:
            ctx.reply("Я тебя не понимаю, используй клавиатуру)");
            break;
    }
});
const testScene = new Scene('test', ctx => {
    ctx.reply('Вы можете 1 раз бесплатно подписать на себя 10 веселых ниггеров в качестве теста бота, готовы?',
        null,
        Markup.keyboard([
            Markup.button('Продолжить', 'positive'),
            Markup.button('Главное меню', 'negative')
        ]));
    ctx.scene.next();
}, ctx => {
    const {body: msg} = ctx.message;
    if(msg === 'Продолжить') {

    }
    if(msg === 'Главное меню') {
        ctx.scene.enter('main')
    }
});
const balanceScene = new Scene('balance', async ctx => {
    const user = await User.findOne({user_id: ctx.message.user_id});
    ctx.reply(`Ваш баланс: ${user.balance} 🤑\n\nЦена 10 ниггеров - 10 рублей! 💰`, null, Markup.keyboard([
        Markup.button('Пополнить баланс', 'positive'),
        Markup.button('Главное меню', 'negative')
    ]));
    ctx.scene.next()
}, ctx => {
    if(ctx.message.body === 'Пополнить баланс') ctx.scene.enter('refilBalance');
    else if(ctx.message.body === 'Главное меню') ctx.scene.enter('main');
    else ctx.reply('Я тебя не понимаю, используй меню')
});
const refilBalanceScene = new Scene('refilBalance', ctx => {
    const url = encodeURI(`https://qiwi.com/payment/form/99?extra['account']=79521344070&currency=643&comment=${ctx.message.user_id}&amountInteger=50&amountFraction=0&blocked[0]=account&blocked[1]=comment`);
    ctx.reply(`💸 Для пополнения баланса, перейдите по ссылке \n\n${url}\n\n✅ После пополнения нажмите на кнопку "Я пополнил балланс"`, null, Markup.keyboard([
        Markup.button('Я пополнил баланс', 'positive'),
        Markup.button('В главное меню', 'negative')
    ]));
    ctx.scene.next()
}, ctx => {
        if(ctx.message.body === 'Я пополнил баланс') {
            // TODO: Make qiwi payment handler
        }
        else if('В главное меню') {
            ctx.scene.enter('main')
        }
        else {
            ctx.reply('Я тебя не понимаю, используй меню')
        }
});
const stage = new Stage(mainScene, testScene, balanceScene, refilBalanceScene);

const checkRefil = () => {

};

module.exports = {
    testScene: testScene,
    mainScene: mainScene,
    balanceScene: balanceScene,
    stage: stage
};