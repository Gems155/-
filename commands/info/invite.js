const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
	name: 'invite',
	description: "เชิญบอท",
	cooldown: 3000,
	userPerms: ['Administrator'],
	botPerms: ['Administrator'],
	run: async (client, message, args) => {
		const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
		const embed = new EmbedBuilder()
		.setTitle('เชิญบอท')
		.setDescription(`เชิญบอทเข้าสู่เซิร์ฟเวอร์ของคุณ [คลิกที่นี่](${inviteUrl})`)
		.setColor('#03fcdb')
		.setTimestamp()
		.setThumbnail(client.user.displayAvatarURL())
		.setFooter({ text: client.user.tag })

		const actionRow = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
			.setLabel('Invite')
			.setURL(inviteUrl)
			.setStyle(5)
		])
		message.reply({ embeds: [embed], components: [actionRow] })
	}
};