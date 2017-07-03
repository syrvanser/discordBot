const { Command } = require('discord.js-commando');

module.exports = class PurgeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            group: 'util',
            memberName: 'purge',
            description: 'Deletes last messages',
            examples: ['purge 10'],
            args: [
                {
                    key: 'messageCount',
                    prompt: 'Number of messages to delete',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        const { messageCount } = args;
        msg.channel.fetchMessages({limit: messageCount}).then(messages => msg.channel.bulkDelete(messages));
    }
};