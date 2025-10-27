const { Client, GatewayIntentBits, ActivityType, SelectMenuBuilder, EmbedBuilder, IntentsBitField, ModalBuilder, AttachmentBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, Events, Partials, ChannelType, PermissionsBitField, Permissions, UserSelectMenuBuilder, MessageManager, Embed, Collection, ButtonBuilder, ActionRowBuilder, ButtonStyle, DefaultDeviceProperty } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "./database/youtube-notifications.sqlite" });
const fs = require('fs');
const config = require('./config.json');

require('dotenv').config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
    ],
});

client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
client.prefix = config.prefix;

module.exports = client;



fs.readdirSync('./handlers').forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});


client.login(config.token).catch(() => {
	console.log(chalk.red('The Token is not valid'))
  })
  process.on("unhandledRejection", (reason, p) => {
	console.log(" [Error_Handling] :: Unhandled Rejection/Catch");
	console.log(reason, p);
  });
  
  process.on("uncaughtException", (err, origin) => {
	console.log(" [Error_Handling] :: Uncaught Exception/Catch");
	console.log(err, origin);
  });
  
  process.on("uncaughtExceptionMonitor", (err, origin) => {
	console.log(" [Error_Handling] :: Uncaught Exception/Catch (MONITOR)");
	console.log(err, origin);
  });