const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Heads or tails?'),
	async execute(interaction) {
        const randomNumber = Math.random(); // Generate a random number between 0 and 1
        let result = 'Heads.'; // Default to heads
        if (randomNumber < 0.5) {
            result = 'Tails.'; // If the random number is less than 0.5, set result to tails
        }
        // Send the result back to the user
		await interaction.reply({ content: result, flags: 64 });
	},
};