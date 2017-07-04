const { Command } = require('discord.js-commando');
const YTDL = require("ytdl-core");
const Servers = require("../../servers.js");

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            group: 'music',
            memberName: 'play',
            description: 'Plays music from youtube',
            examples: ['play https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
            args: [
                {
                    key: 'link',
                    prompt: 'A youtube link',
                    type: 'string'
                }
            ]
        });
    }

    play(connection, id) {
        var server = Servers.getServer(id);
        let stream = YTDL(server.queue[0], { filter: "audioonly" });
        server.dispatcher = connection.playStream(stream, { passes: 1 }); //Download video from youtube
        server.queue.shift(); //Remove the first element from the queue array
        
        server.dispatcher.on("error", (err) => {
            msg.channel.sendMessage(err);
            
            connection.disconnect();
            
        });

       
        server.dispatcher.on("end", () => {
            if (server.queue[0]) {
                this.play(connection, id);
            }
            else {
                connection.disconnect();
            }
        });

    }

    run(msg, args) {
        const { link } = args; //link is the first argument

        if (!msg.member.voiceChannel) {
            msg.say("You must be in a voice channel");
            return;
        }

        var server = Servers.getServer(msg.guild.id);
        YTDL.getInfo(link).then(() => {
            console.log("Video was found");
            server.queue.push(link); //add link to the queue

            if (!msg.guild.voiceConnection) {
                msg.member.voiceChannel.join().then((connection) => this.play(connection, msg.guild.id)); //join and play
            }

            msg.say('Your song has been added to the queue');
        },
            ((error) => {
                msg.say("The requested video does not exist or cannot be played.");
                console.log(error);
            }));









    }
};