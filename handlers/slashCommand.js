const fs = require('fs');
const chalk = require('chalk');
const configs = require('../config.json')
const { PermissionsBitField } = require('discord.js');
const { Routes } = require('discord-api-types/v10');
const { REST } = require('@discordjs/rest')

const AsciiTable = require('ascii-table');
const table = new AsciiTable().setHeading('Slash Commands', 'Stats').setBorder('|', '=', "0", "0")

const rest = new REST({ version: '10' }).setToken(configs.token);

module.exports = (client) => {
	const slashCommands = []; 

	fs.readdirSync('./slashCommands/').forEach(async dir => {
		const files = fs.readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith('.js'));

		for(const file of files) {
				const slashCommand = require(`../slashCommands/${dir}/${file}`);
				slashCommands.push({
					name: slashCommand.name,
					description: slashCommand.description,
					type: slashCommand.type,
					options: slashCommand.options ? slashCommand.options : null,
					default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
					default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
				});
			
				if(slashCommand.name) {
						client.slashCommands.set(slashCommand.name, slashCommand)
						table.addRow(file.split('.js')[0], '✅')
				} else {
						table.addRow(file.split('.js')[0], '⛔')
				}

       if (slashCommand.developers_only && slashCommand.developers_only === true) {
                if (config.users?.developers && config.users?.developers?.length > 0) {
                    if (!config.users.developers.some((dev) => interaction.user.id === dev)) return interaction.reply({
                        content: `\`❌\`We're sorry, but this command is restricted to developers only!`,
                        ephemeral: true
                    });
                };
            };
		}
		
	});
	console.log(chalk.red(table.toString()));

	(async () => {
			try {
				await rest.put(
					Routes.applicationCommands(configs.clientID), 
					{ body: slashCommands }
				);
				console.log(chalk.yellow('Slash Commands • Registered'))
			} catch (error) {
				console.log(error);
			}
	})();
};

///////////////////////////////////////////////////////////////////
///////// dev by tn hazem youtube
///////// server discord https://discord.gg/c4-clan-community-917454141087965244
//////// Development c4 clan community
/////////////////////////////////////////////////////////////////