const { ApplicationCommandType } = require('discord.js');

module.exports = {
	name: 'ping',
	description: "เช็ตปิงจากบอท",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
		interaction.reply({ content: `ความเร็ว : **${Math.round(client.ws.ping)} ms**` })
	}
};