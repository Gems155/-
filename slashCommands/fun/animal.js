const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
	name: 'animal',
	description: "คำสั่งทดสอบสำหรับแสดงคำสั่งทับเติมข้อความอัตโนมัติ",
	type: ApplicationCommandType.ChatInput,
	options: [
        {
            name: 'animal',
            description: 'เลือกสัตว์',
            type: 3,
            required: true,
            autocomplete: true
        }
    ],
    autocomplete: (interaction, choices) => {
        const data = {
            '908385923673231481': ['dog', 'cat', 'rabbit'],
            '967751631695405097': ['lizard', 'horse', 'hamster']
        }
        data[interaction.guild.id].forEach(animal => {
            choices.push({
                name: `${animal}`,
                value: `${animal}`
            });
        });
        interaction.respond(choices).catch(console.error);
    },
	run: async (client, interaction) => {
        const animal = interaction.options.get('animal').value;
        if(animal) interaction.reply({ content: `${interaction.user}, คุณเลือก **${animal}**!` });
	}
};