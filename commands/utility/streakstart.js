const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { dataPath, debugMode } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('streakstart')
		.setDescription('Start a streak')
		.addStringOption(option =>
			option.setName('player')
				.setDescription('The player\'s name')),
	async execute(interaction) {
		const player = interaction.options.getString('player');
		if (typeof player == 'undefined') {
			await interaction.reply('Target not defined.');
			return;
		}
		let activeStreaks = {};
		fs.readFile(dataPath, 'utf8', function(err, data) {
			if (err) {
		  		return err;
			}
			if (typeof data == 'undefined' || data.trim() == '') return;
			activeStreaks = JSON.parse(data);
			activeStreaks[player] = 0;
			fs.writeFile(dataPath, JSON.stringify(activeStreaks), async function(err) {
				if (err) {
					console.log(err);
					return err;
				}
				if (debugMode) {
					console.log(player + " saved! " + new Date().toLocaleString());
					console.log('.activeStreaks' + ' saved! ' + new Date().toLocaleString());
				}
				const streak = ['Active Streaks\n', '--------------\n'];
		    for (const i in activeStreaks) {
			    streak.push(i + ': ' + activeStreaks[i] + '\n');
		    }
		    await interaction.reply({ content: streak.join(''), flags: 64 });
		  });
		});
	},
};