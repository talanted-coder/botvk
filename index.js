const vkBot = require('node-vk-bot-api');
const Session = require('node-vk-bot-api/lib/session');
const token = '9f26026779817ac460f4cc85cfe2ee3feb8375b4f964d7b82d9cd1d796384c4734748e06ad1dcc9048d95';
const mongoose = require('mongoose');
const {stage} = require('./modules');

const User = require('./model');

const uri = "mongodb+srv://vladislav:343370728@cluster0-ozeud.mongodb.net/main?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const bot = new vkBot(token);
const session = new Session();

bot.use(session.middleware());
bot.use(stage.middleware());

bot.on(async ctx => {
    if(!await User.findOne({user_id: ctx.message.user_id})) {
        const user = new User({
            user_id: ctx.message.user_id,
            balance: 5
        });
        console.log(await user.save());
    }
    ctx.scene.enter('main');
    console.log()
});

bot.startPolling();

