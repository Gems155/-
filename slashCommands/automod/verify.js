const { ApplicationCommandType, PermissionsBitField, ApplicationCommandOptionType, ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "./database/verify.sqlite" });

module.exports = {
    name: 'setup-verification',
    description: 'ติดตั้งระบบตรวจสอบสมาชิก',
    type: ApplicationCommandType.ChatInput,
  userPerms: [PermissionsBitField.Flags.ManageGuild],
    options: [
        {
            name: 'role',
            description: 'ยศที่ให้สมาชิก',
            type: ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: 'channel',
            description: 'ช่องที่ให้บอทติดตั้ง',
            type: ApplicationCommandOptionType.Channel,
            required: true,
            channelTypes: ['GUILD_TEXT'], 
            autocomplete: true
        }
    ],
    run: async (client, interaction) => {
        const role = interaction.options.get('role').role;
        const channel = interaction.options.getChannel('channel', false);

        await db.set(`verification.${interaction.guild.id}`, { Role: role.id, Channel: channel?.id, Verified: [] });

        const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('verification_level')
        .setPlaceholder('เลือกระดับการตรวจสอบ')
        .addOptions(
            {
                label: 'ต่ำ',
                value: 'low',
                emoji:'🔴',
                description: 'กดปุ่มรับยศเลย'
            },
            {
                label: 'กลาง',
                value: 'medium',
                emoji:'🟡',
                description: 'กดปุ่มตัวอักษรที่เห็น'
            },
            {
                label: 'สูง',
                value: 'high',
                emoji:'🟢',
                description: 'เขียนข้อความที่เห็น'
            }
        );
    
    
        const verify = new EmbedBuilder()
            .setColor('#20be30')
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp()
            .setTitle('• เมนูแอดมิน กรุณาตั้งค่าระดับการใช้งาน')
            .setAuthor({ name: `🪪 ระบบตรวจสอบ` })
            .setFooter({ text: `เวอร์ชั้น : ทดลอง 0.5`, iconURL: interaction.guild.iconURL() })


            const msg = await interaction.reply({ content: `เราได้ทำการติดตั้งระบบให้แล้ว **ขอบคุณที่มาทดลองใช้บอทเรา**`, embeds: [verify], components: [new ActionRowBuilder().addComponents(selectMenu)], ephemeral: true });

        const filter = (i) => i.customId === 'verification_level';
        const collector = msg?.createMessageComponentCollector({ filter, time: 60000 });

        collector?.on('collect', async (i) => {
            if (i.customId === 'verification_level') {
                const level = i.values[0];
                if (level === 'low') {
                    const verify = new EmbedBuilder()
                    .setColor('#20be30')
                        .setThumbnail(interaction.guild.iconURL())
                        .setTimestamp()
                        .setTitle('• ระบบตรวจสอบ ระดับ : **ต่ำ**')
                        .setDescription('กดปุ่ม \`รับยศ\` เพื่อรับยศเลยค่ะ')
                        .setAuthor({ name: `🪪 ระบบตรวจสอบสมาชิก` })
                        .setFooter({ text: `เวอร์ชั้น : ทดลอง 0.5` });

                    const buttons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`verify${level}`)
                                .setLabel('รับยศ')
                                .setStyle(ButtonStyle.Success)
                        );

                    await channel?.send({ embeds: [verify], components: [buttons] });
                    await i.update({ content: `**ระบบตรวจสอบ ระดับ : ${level}** ของคุณถูกตั้งค่าเรียบร้อยแล้ว!`, components: [], ephemeral: true  });
                } else if (level === 'medium') {
                    const verify = new EmbedBuilder()
                    .setColor('#20be30')
                        .setThumbnail(interaction.guild.iconURL())
                        .setTimestamp()
                        .setTitle('• ระบบตรวจสอบ ระดับ : **กลาง**')
                        .setDescription('กดปุ่ม \`รับยศ\` เพื่อรับยศเลยค่ะ')
                        .setAuthor({ name: `🪪 ระบบตรวจสอบสมาชิก` })
                        .setFooter({ text: `เวอร์ชั้น : ทดลอง 0.5` });

                    const buttons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`verify${level}`)
                                .setLabel('รับยศ')
                                .setStyle(ButtonStyle.Success)
                        );

                    await channel?.send({ embeds: [verify], components: [buttons] });
                    await i.update({ content: `**ระบบตรวจสอบ ระดับ : ${level}** ของคุณถูกตั้งค่าเรียบร้อยแล้ว!`, components: [], ephemeral: true  });
                } else if (level === 'high') {
                    const verify = new EmbedBuilder()
                    .setColor('#20be30')
                        .setThumbnail(interaction.guild.iconURL())
                        .setTimestamp()
                        .setTitle('• ระบบตรวจสอบ ระดับ : **สูง**')
                        .setDescription('กดปุ่ม \`รับยศ\` เพื่อรับยศเลยค่ะ')
                        .setAuthor({ name: `🪪 ระบบตรวจสอบสมาชิก` })
                        .setFooter({ text: `✅ Verification Prompt` });

                    const buttons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`verify${level}`)
                                .setLabel('รับยศ')
                                .setStyle(ButtonStyle.Success)
                        );

                    await channel?.send({ embeds: [verify], components: [buttons] });
                    await i.update({ content: `**ระบบตรวจสอบ ระดับ : ${level}** ของคุณถูกตั้งค่าเรียบร้อยแล้ว!`, components: [], ephemeral: true  });
                }
            }
        });
    }
};

