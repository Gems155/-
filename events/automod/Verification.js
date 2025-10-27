const { CaptchaGenerator } = require('captcha-canvas');
const { EmbedBuilder, ModalBuilder, AttachmentBuilder,TextInputBuilder, TextInputStyle, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require(`discord.js`);
const client = require("../../index.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "./database/verify.sqlite" });
const  low = 'low';
const  medium = 'medium';
const  high = 'high';

client.on('interactionCreate', async interaction => {
  if (interaction.guild === null) return;
  
    const verificationData = await db.get(`verification.${interaction.guild.id}`);

    if (interaction.customId === `verify${low}`) {
      const memberRole = await interaction.guild.roles.fetch(verificationData.Role);
            
          await interaction.member.roles.add(memberRole);
       
          await interaction.reply({ content: 'ยินดีด้วยคุณได้รับการยืนยันแล้ว!', ephemeral: true });
          }
        });


client.on('interactionCreate', async interaction => {
if (interaction.guild === null) return;
  const verifydata = await db.get(`verification.${interaction.guild.id}`);
  const verifyusersdata = await db.get(`verifyusers.${interaction.guild.id}.${interaction.user.id}`);

  if (interaction.customId === `verify${medium}`) {

          let letter = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'f', 'F', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z'];
          let result = Math.floor(Math.random() * letter.length);
          let result2 = Math.floor(Math.random() * letter.length);
          let result3 = Math.floor(Math.random() * letter.length);
          let result4 = Math.floor(Math.random() * letter.length);
          let result5 = Math.floor(Math.random() * letter.length);

          const cap = letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5];
          console.log(cap);
          function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; 
            }
            return array;
        }

        let selectedButtons = Array.from(cap); 
        let uniqueButtons = [...new Set(selectedButtons)]; 
        uniqueButtons = shuffle(uniqueButtons); 
    
          const captcha = new CaptchaGenerator()
              .setDimension(150, 450)
              .setCaptcha({ text: `${cap}`, size: 60, color: "green" })
              .setDecoy({ opacity: 0.5 })
              .setTrace({ color: "green" });

          const buffer = captcha.generateSync();

          const verifyattachment = new AttachmentBuilder(buffer, { name: `captcha.png` });

          const verifyembed = new EmbedBuilder()
              .setColor('#20be30')
              .setAuthor({ name: `🔐 ระบบกำลังทำการตรวจสอบคุณ | ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
              .setFooter({ text: `🪪 ระบบยืนยันตัวตน` })
              .setTimestamp()
              .setImage('attachment://captcha.png')
              .setTitle('> ยืนยันตัวตนด้วย : Captcha')
              .addFields(
                { name: 'ใส่รหัส', value: '\`\`\`.\`\`\`' },
            );
              let buttonRow1 = new ActionRowBuilder();
let buttonRow2 = new ActionRowBuilder();
              uniqueButtons.forEach((char, index) => {
                if (index < 5) {
                    buttonRow1.addComponents(
                        new ButtonBuilder()
                            .setLabel(char)
                            .setCustomId(`char_${char}`)
                            .setStyle(ButtonStyle.Secondary)
                    );
                } else {
                    buttonRow2.addComponents(
                        new ButtonBuilder()
                            .setLabel(char)
                            .setCustomId(`char_${char}`)
                            .setStyle(ButtonStyle.Secondary)
                    );
                }
            });
        
              // Adding confirm and cancel buttons
              buttonRow2.addComponents(
                new ButtonBuilder()
                  .setLabel('เสร็จสิ้น')
                  .setCustomId('confirm')
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setLabel('ยกเลิก')
                  .setCustomId('cancel')
                  .setStyle(ButtonStyle.Danger)
              );


              await db.set(`verifyusers.${interaction.guild.id}.${interaction.user.id}`, cap);


          await interaction.reply({ embeds: [verifyembed], components: [buttonRow1, buttonRow2 ], ephemeral: true, files: [verifyattachment] });

          await db.set(`verifyuserss.${interaction.guild.id}.${interaction.user.id}`, { userInput: '' });
        }

      else if (interaction.customId && interaction.customId.startsWith('char_')) { 
        let char = interaction.customId.split('_')[1];
          let currentData = await db.get(`verifyuserss.${interaction.guild.id}.${interaction.user.id}`);
          let updatedInput = `${currentData.userInput}${char}`;
    
          await db.set(`verifyuserss.${interaction.guild.id}.${interaction.user.id}.userInput`, updatedInput);
          if (interaction.message && interaction.message.embeds.length > 0) {
            const storedCaptcha = await db.get(`verifyusers.${interaction.guild.id}.${interaction.user.id}`);

            const captcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({ text: `${storedCaptcha}`, size: 60, color: "green" })
            .setDecoy({ opacity: 0.5 })
            .setTrace({ color: "green" });

        const buffer = captcha.generateSync();

        const verifyattachment = new AttachmentBuilder(buffer, { name: `captcha.png` });
                     const verifyembed = new EmbedBuilder()
              .setColor('#20be30')
              .setAuthor({ name: `🔐 ระบบกำลังตรวจสอบคุณ | ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })

              .setFooter({ text: `🪪 ระบบยืนยันตัวตน` })
              .setTimestamp()
              .setImage('attachment://captcha.png')
              .setTitle('> ระบบยืนยันตัวตนด้วย : Captcha')
              .addFields(
                { name: `• ระบบ`, value: '> กรุณาใช้ปุ่มด้านล่างเพื่อส่ง captcha ของคุณ!' },
                { name: 'ใส่รหัส', value: `\`\`\`${updatedInput}\`\`\`` },
            );
            await interaction.update({ embeds: [verifyembed], files: [verifyattachment]  });
        } else {
            console.error('No embeds found in the message to update.');
            await interaction.reply({ content: 'No embeds to update.', ephemeral: true });
        }
        
        }
      
        else if (interaction.customId === 'confirm') {
          let userData = await db.get(`verifyuserss.${interaction.guild.id}.${interaction.user.id}`);
          const correctCaptcha = await db.get(`verifyusers.${interaction.guild.id}.${interaction.user.id}`);
        
          await interaction.update({ content: '<:loading:1340889971648888842>  กำลังตรวจสอบ . . .',files: [] , embeds: [],components: [] });

          await new Promise(resolve => setTimeout(resolve, 3000));
        
          if (userData.userInput === correctCaptcha) {
            const verificationData = await db.get(`verification.${interaction.guild.id}`);
            const memberRole = await interaction.guild.roles.fetch(verificationData.Role);
        
            await interaction.member.roles.add(memberRole);
        
            await interaction.editReply({ content: '<:vf:1033403737395437609>  เรียบร้อย ยินดีต้อนรับคับ ! ',files: [] , embeds: [],components: [] });
          } else {
            await interaction.editReply({ content: '<:error:952882856953258035>  คุณใส่รหัสผิด กรุณาลองใหม่ ',files: [], embeds: [],components: [] });
          }
        }
        else if (interaction.customId === 'cancel') {
  
          await db.delete(`verifyuserss.${interaction.guild.id}.${interaction.user.id}`);
          
          await interaction.update({
            content: ':x:  คุณยกเลิกการตรวจสอบ ',
            embeds: [],
            components: [],
            files:[]
          });
        }
      });

      client.on('interactionCreate', async interaction => {
        if (interaction.guild === null) return;
        
          const verifydata = await db.get(`verification.${interaction.guild.id}`);
          const verifyusersdata = await db.get(`verifyusers.${interaction.guild.id}.${interaction.user.id}`);
          if (interaction.customId === `verify${high}`) {
                  let letter = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'f', 'F', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z'];
                  let result = Math.floor(Math.random() * letter.length);
                  let result2 = Math.floor(Math.random() * letter.length);
                  let result3 = Math.floor(Math.random() * letter.length);
                  let result4 = Math.floor(Math.random() * letter.length);
                  let result5 = Math.floor(Math.random() * letter.length);
                  const cap = letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5];
                  console.log(cap);
                  
                  const captcha = new CaptchaGenerator()
                      .setDimension(150, 450)
                      .setCaptcha({ text: `${cap}`, size: 60, color: "green" })
                      .setDecoy({ opacity: 0.5 })
                      .setTrace({ color: "green" });
        
                  const buffer = captcha.generateSync();
        
                  const verifyattachment = new AttachmentBuilder(buffer, { name: `captcha.png` });
        
                  const verifyembed = new EmbedBuilder()
                      .setColor('#20be30')
                      .setAuthor({ name: `🔐 ระบบกำลังตรวจสอบคุณ | ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                      .setTimestamp()
                      .setImage('attachment://captcha.png')
                      .setTitle('> ระบบยืนยันตัวตนด้วย : การเขียน Captcha');
                  const verifybutton = new ActionRowBuilder()
                      .addComponents(
                          new ButtonBuilder()
                              .setLabel('ใส่รหัส')
                              .setStyle(ButtonStyle.Success)
                              .setCustomId('captchaenter')
                      );
               
        
                      await db.set(`verifyusers.${interaction.guild.id}.${interaction.user.id}`, cap);

                  await interaction.reply({ embeds: [verifyembed], components: [verifybutton ], ephemeral: true, files: [verifyattachment] });
        
                  await db.set(`verifyuserss.${interaction.guild.id}.${interaction.user.id}`, { userInput: '' });
                }
              });
          
client.on('interactionCreate', async interaction => {
if (!interaction.isCommand() && interaction.isButton() && interaction.customId === 'captchaenter') {
    const captchaData = await db.get(`verifyusers.${interaction.guild.id}.${interaction.user.id}`);
    
    if (captchaData) {
        const modal = new ModalBuilder()
            .setCustomId('verificationModal')
            .setTitle('ยืนยันตัวตน');
        
        const captchaInput = new TextInputBuilder()
            .setCustomId('captchaInput')
            .setLabel('ใส่ตัวหนังสือที่คุณเห็น')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const firstActionRow = new ActionRowBuilder().addComponents(captchaInput);
        modal.addComponents(firstActionRow);
    
        await interaction.showModal(modal);

    }
}
else if (interaction.isModalSubmit() && interaction.customId === 'verificationModal') {
    const userResponse = interaction.fields.getTextInputValue('captchaInput');
    const storedCaptcha = await db.get(`verifyusers.${interaction.guild.id}.${interaction.user.id}`);
    
    if (userResponse === storedCaptcha) {
        const verificationData = await db.get(`verification.${interaction.guild.id}`);
        
        if (verificationData && verificationData.Verified && verificationData.Verified.includes(interaction.user.id)) {
            await interaction.reply({ content: 'คุณได้รับการตรวจสอบแล้ว!', ephemeral: true });
        } else {
            const memberRole = await interaction.guild.roles.fetch(verificationData.Role);
            
            if (memberRole) {
                await interaction.member.roles.add(memberRole);
             
                await interaction.reply({ content: 'คุณได้รับการตรวจสอบแล้ว!', ephemeral: true });
            }
        }
    } else {
        await interaction.reply({ content: 'คุณใส่รหัสผิด กรุณาลองใหม่อีกครั้ง', ephemeral: true });
    }
}
});