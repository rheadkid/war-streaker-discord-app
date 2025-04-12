const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, debugMode } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Check operating system
const isWindows = os.platform() === 'win32';
const isLinux = os.platform() === 'linux';
if (debugMode) {
	console.log('WarStreaker is running in debug mode!');
	console.log(`Running on: ${os.platform()} (${os.type()} ${os.release()})`);
	console.log(`Is Windows: ${isWindows}, Is Linux: ${isLinux}`);
}

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	if (debugMode) console.log('index.js line 42: interaction:', interaction);

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error('There was an error while executing this command!', error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

// Button click handler
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;
    
    // Handle streak menu buttons
    if (interaction.customId.startsWith('streak_')) {
        const subcommandType = interaction.customId.replace('streak_', '');
        
        // Get the main streak command
        const streakCommand = interaction.client.commands.get('streak');
        if (!streakCommand) {
            await interaction.reply({ content: 'Streak command not found.', ephemeral: true });
            return;
        }
        
        // Check button doesn't need player name, execute directly
        if (subcommandType === 'check') {
            try {
                // Create a subcommand option
                interaction.options = {
                    getSubcommand: () => 'check',
                    getString: () => null
                };
                
                await streakCommand.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ 
                    content: 'There was an error executing that command!',
                    ephemeral: true
                });
            }
            return;
        }
        
        // Other buttons need player name, show modal
        const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
        
        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId(`streak_modal_${subcommandType}`)
            .setTitle(`${subcommandType.charAt(0).toUpperCase() + subcommandType.slice(1)} Streak`);
            
        // Add player name input
        const playerInput = new TextInputBuilder()
            .setCustomId('playerName')
            .setLabel('Player Name')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter player name')
            .setRequired(true);
            
        // Add inputs to the modal
        const firstActionRow = new ActionRowBuilder().addComponents(playerInput);
        modal.addComponents(firstActionRow);
            
        // Show the modal
        await interaction.showModal(modal);
    }
});

// Modal submission handler
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;
    
    if (interaction.customId.startsWith('streak_modal_')) {
        const subcommandType = interaction.customId.replace('streak_modal_', '');
        const playerName = interaction.fields.getTextInputValue('playerName');
        
        const streakCommand = interaction.client.commands.get('streak');
        if (!streakCommand) {
            await interaction.reply({ content: 'Streak command not found.', ephemeral: true });
            return;
        }
        
        try {
            // Set up options for the subcommand structure
            interaction.options = {
                getSubcommand: () => subcommandType,
                getString: (name) => {
                    if (name === 'player') return playerName;
                    return null;
                }
            };
            
            await streakCommand.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: 'There was an error executing that command!', 
                ephemeral: true
            });
        }
    }
});