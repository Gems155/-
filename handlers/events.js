const fs = require('fs');
const chalk = require('chalk');
var AsciiTable = require('ascii-table');
var table = new AsciiTable();

table.setHeading('Events', 'Stats').setBorder('|', '=', "0", "0");

module.exports = (client) => {

    fs.readdirSync('./events/').forEach(dir => {

        if (fs.statSync(`./events/${dir}`).isDirectory()) {
         
            const files = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));
            files.forEach(event => {
                require(`../events/${dir}/${event}`);
                table.addRow(event.split('.js')[0], '✅');
            });
        }
    });
    console.log(chalk.greenBright(table.toString()));
};
