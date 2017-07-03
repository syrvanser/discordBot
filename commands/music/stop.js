const { Command } = require('discord.js-commando');
const Servers = require("../../servers.js");

module.exports = class StopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            group: 'music',
            memberName: 'stop',
            description: 'Stops the music',
            examples: ['stop'],
        });
    }

    run(msg) {
        if (msg.guild.voiceConnection) {
            msg.guild.voiceConnection.disconnect();
        }

    }
};