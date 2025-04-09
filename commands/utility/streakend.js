const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { dataPath, debugMode } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('streakend')
		.setDescription('End a streak')
		.addStringOption(option =>
			option.setName('player')
				.setDescription('The player\'s name')),
	async execute(interaction) {
		const player = interaction.options.getString('player');
		if (typeof player == 'undefined') {
			await interaction.reply({ content: 'Target not defined.', flags: 64 });
			return;
		}
		let activeStreaks = {};
		fs.readFile(dataPath, 'utf8', function(err, data) {
			if (err) {
		  return err;
			}
			if (typeof data == 'undefined' || data.trim() == '') return;
			activeStreaks = JSON.parse(data);
			delete (activeStreaks[player]);
			fs.writeFile(dataPath, JSON.stringify(activeStreaks), async function(err) {
				if (err) {
					console.log(err);
					return err;
				}
				// console.log(fname + " saved!");
				if (debugMode) console.log('index.js line 42: interaction:', interaction);console.log('.activeStreaks' + ' saved!');
				const streak = ['Active Streaks\n', '--------------\n'];
				for (const i in activeStreaks) {
					streak.push(i + ': ' + activeStreaks[i] + '\n');
				}
				await interaction.reply({ content: streak.join(''), flags: 64 });
			});
		});
	},
};