
const { Command } = require('discord.js-commando');
const Servers = require("../../servers.js");

module.exports = class StopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            group: 'music',
            memberName: 'skip',
            description: 'Skips the active track',
            examples: ['skip'],
        });
    }

    run(msg) {
         if (Servers.getServer(msg.guild.id).dispatcher) Servers.getServer(msg.guild.id).dispatcher.end();
    }
};