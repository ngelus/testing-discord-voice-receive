const { Events, VoiceState } = require('discord.js');

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState, newState) {
    if (oldState.channel == newState.channel) {
      /**
       * When a user deafens or mutes themselfs.
       */
      return;
    }
    if (newState.channel) {
      /**
       * When a user joins a voice channel.
       */
      return console.log('USER JOINED A VC');
    }
    if (oldState.channel) {
      /**
       * When a user leaves a voice channel.
       */
      return console.log('USER LEFT A VC');
    }
  },
};
