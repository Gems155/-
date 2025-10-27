const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
	name: 'role',
	description: "จัดการบทบาทของเซิร์ฟเวอร์หรือสมาชิก",
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
    	default_member_permissions: 'ManageRoles', // permission required
	options: [
        {
            name: 'add',
            description: 'เพิ่มบทบาทให้กับผู้ใช้',
            type: 1,
            options: [
                {
                    name: 'role',
                    description: 'บทบาทที่คุณต้องการเพิ่มให้กับผู้ใช้',
                    type: 8,
                    required: true
                },
                {
                    name: 'user',
                    description: 'ผู้ใช้ที่คุณต้องการเพิ่มบทบาท',
                    type: 6,
                    required: true
                }
            ]
        }
    ],
	run: async (client, interaction) => {
	 if(interaction.options._subcommand === 'add') {
            try {
                const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
                const role = interaction.options.get('role').role;
    
                await member.roles.add(role.id);
                const embed = new EmbedBuilder()
                .setTitle('Role Added')
                .setDescription(`เรียบร้อย เพิ่มบทบาท : ${role} ให้กับ ${member}`)
                .setColor('Green')
                .setTimestamp()
                .setThumbnail(member.user.displayAvatarURL())
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
        
                return interaction.reply({ embeds: [embed] })
            } catch {
                return interaction.reply({ content: `ขออภัย ฉันไม่สามารถเพิ่มบทบาทนั้นให้กับคุณได้!`, ephemeral: true });
            }

        }
    }
};