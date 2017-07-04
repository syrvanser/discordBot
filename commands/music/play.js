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

    play(connection, msg) {

        let id = msg.guild.id;
        var server = Servers.getServer(id);

        YTDL.getInfo(server.queue[0], (error, info) => {
            msg.reply("The requested video does not exist or cannot be played.");
            console.log(error);
            queue.songs.shift();
            this.play(connection, msg);
        });

        let stream = YTDL(server.queue[0], { filter: "audioonly" });

        server.dispatcher = connection.playStream(stream, { passes: PASSES }); //Download video from youtube

        server.dispatcher.on("error", (err) => {
            msg.channel.sendMessage('error: ' + err);
            queue.songs.shift();
            this.play(connection, msg);
        });

        server.queue.shift(); //Remove the first element from the queue array


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
        YTDL.getInfo(link, (error, info) => {
            msg.say("The requested video does not exist or cannot be played.");
            console.log(error);
            return;
        });
        
        server.queue.push(link); //add link to the queue
        
        




        if (!msg.guild.voiceConnection) {
            msg.member.voiceChannel.join().then((connection) => this.play(connection, msg)); //join and play
        }

        return msg.say('Playing!');
    }
};