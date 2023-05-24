const { Events, VoiceState } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
require('dotenv').config();
const { DISCORD_OWNER_ID: OWNER_ID } = process.env;

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState, newState) {
    var vc = '';
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
      if (newState.member.id == OWNER_ID) {
        try {
          vc = joinVoiceChannel({
            channelId: newState.member.voice.channelId,
            guildId: newState.guild.id,
            adapterCreator: newState.guild.voiceAdapterCreator,
            selfDeaf: false,
          });
        } catch (error) {
          console.error(
            `[ERROR] Error joining ${newState.member.voice.channel?.name}!`
          );
          console.error(error);
        }
        return;
      }
    }
    if (oldState.channel && !newState.channel) {
      /**
       * When a user leaves a voice channel.
       */
      try {
        vc = getVoiceConnection(oldState.guild.id);
        vc.disconnect();
      } catch (error) {
        console.error(
          `[ERROR] Error disconnecting from ${newState.member.voice.channel?.name}!`
        );
        console.error(error);
      }
      return;
    }
  },
};
