const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`[INFO] ${client.user.tag} is ready for work!`);
  },
};
