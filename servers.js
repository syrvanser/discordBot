var servers = {};

exports.getServer = (id) =>{ //Getter for the servers array
    if (!servers[id]) { //if server doesn't exist add it
            servers[id] = {
                queue: []
            };
        }

    return servers[id];

};