const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cointoss')
		.setDescription('Heads?'),
	async execute(interaction) {
		await interaction.reply('Heads.');
	},
};