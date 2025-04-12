const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { dataPath, debugMode } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('streak')
        .setDescription('Manage player streaks')
        .addSubcommand(subcommand =>
            subcommand
                .setName('check')
                .setDescription('Check all active streaks'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start a new streak')
                .addStringOption(option =>
                    option.setName('player')
                        .setDescription('The player\'s name')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('plus')
                .setDescription('Increase a streak by 1')
                .addStringOption(option =>
                    option.setName('player')
                        .setDescription('The player\'s name')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('End an active streak')
                .addStringOption(option =>
                    option.setName('player')
                        .setDescription('The player\'s name')
                        .setRequired(true))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'check') {
            // Handle check subcommand
            let activeStreaks = {};
            fs.readFile(dataPath, 'utf8', async function(err, data) {
                if (err) {
                    return err;
                }
                if (typeof data == 'undefined' || data.trim() == '') return;
                activeStreaks = JSON.parse(data);
                if (debugMode) console.log('streak check:', activeStreaks);
                const streak = ['Active Streaks\n', '--------------\n'];
                for (const i in activeStreaks) {
                    streak.push(i + ': ' + activeStreaks[i] + '\n');
                }
                await interaction.reply({ content: streak.join(''), flags: 64 });
            });
        } 
        else if (subcommand === 'start') {
            // Handle start subcommand
            const player = interaction.options.getString('player');
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
        } 
        else if (subcommand === 'plus') {
            // Handle plus subcommand
            const player = interaction.options.getString('player');
            let activeStreaks = {};
            fs.readFile(dataPath, 'utf8', function(err, data) {
                if (err) {
                    return err;
                }
                if (typeof data == 'undefined' || data.trim() == '') return;
                activeStreaks = JSON.parse(data);
                if (typeof activeStreaks[player] == 'undefined') return 'No such player!';
                activeStreaks[player] += 1;
                fs.writeFile(dataPath, JSON.stringify(activeStreaks), async function(err) {
                    if (err) {
                        console.log(err);
                        return err;
                    }
                    if (debugMode) console.log('.activeStreaks' + ' saved!');
                    const streak = ['Active Streaks\n', '--------------\n'];
                    for (const i in activeStreaks) {
                        streak.push(i + ': ' + activeStreaks[i] + '\n');
                    }
                    await interaction.reply({ content: streak.join(''), flags: 64 });
                });
            });
        } 
        else if (subcommand === 'end') {
            // Handle end subcommand
            const player = interaction.options.getString('player');
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
                    if (debugMode) console.log('.activeStreaks' + ' saved!');
                    const streak = ['Active Streaks\n', '--------------\n'];
                    for (const i in activeStreaks) {
                        streak.push(i + ': ' + activeStreaks[i] + '\n');
                    }
                    await interaction.reply({ content: streak.join(''), flags: 64 });
                });
            });
        }
    },
};