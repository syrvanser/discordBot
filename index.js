const Tokens = require('./tokens.json');
const { CommandoClient, FriendlyError } = require('discord.js-commando');
const path = require('path');
const client = new CommandoClient({
	owner: Tokens.adminID,
	commandPrefix: '_',
	disableEveryone: true
});


client.registry
	// Registers custom command groups
	.registerGroups([
		['olc', 'Open legend commands'],
		['music', 'Music commands'],
		['test', 'test'],
		['util', 'Utilities']
	])

	// Registers all built-in groups, commands, and argument types
	.registerDefaults()

	// Registers all commands in the ./commands/ directory
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('error', console.error) //Error handling
	.on('warn', console.warn) //Warning handling
	.on('debug', console.log) //Debug message handling - turn off to disable heartbeats messages
	.on('ready', () => { //Start message
		console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
	})
	.on('disconnect', () => { console.warn('Disconnected!'); }) //Disconnect
	.on('reconnecting', () => { console.warn('Reconnecting...'); }) //Reconnecting
	.on('commandError', (cmd, err) => { //Command error handling
		if(err instanceof FriendlyError) return; //Do not display this for user-friendly errors 
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => { //Blocked command
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => { //Prefix change
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => { //Status change
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => { //Group status change
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});

client.login(Tokens.token);