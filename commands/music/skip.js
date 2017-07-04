
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
         if (server.dispatcher) server.d.end();
    }
};