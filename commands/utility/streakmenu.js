const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const { dataPath, debugMode } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('streakmenu')
        .setDescription('Show streak command menu'),
    async execute(interaction) {
        // Create buttons for each subcommand
        const checkButton = new ButtonBuilder()
            .setCustomId('streak_check')
            .setLabel('Check Streaks')
            .setStyle(ButtonStyle.Secondary);

        const startButton = new ButtonBuilder()
            .setCustomId('streak_start')
            .setLabel('Start Streak')
            .setStyle(ButtonStyle.Primary);
            
        const plusButton = new ButtonBuilder()
            .setCustomId('streak_plus')
            .setLabel('Streak Plus')
            .setStyle(ButtonStyle.Success);

        const endButton = new ButtonBuilder()
            .setCustomId('streak_end')
            .setLabel('End Streak')
            .setStyle(ButtonStyle.Danger);

        // Add buttons to an action row
        const row = new ActionRowBuilder()
            .addComponents(checkButton, startButton, plusButton, endButton);
        
        // Send the menu
        await interaction.reply({
            content: 'Choose a streak command:',
            components: [row]
        });
    }
};
