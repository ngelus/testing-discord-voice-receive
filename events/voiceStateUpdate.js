const path = require('path');
const fs = require('fs');
const ffmpeg = require('ffmpeg');
const prism = require('prism-media');
const { Events, VoiceState } = require('discord.js');
const {
  joinVoiceChannel,
  getVoiceConnection,
  EndBehaviorType,
  VoiceReceiver,
} = require('@discordjs/voice');
require('dotenv').config();
const { DISCORD_OWNER_ID: OWNER_ID } = process.env;

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState, newState) {
    var vc = '';
    var audioReceiver = '';
    var audioReceiveStream = '';
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
        try {
          if (vc) {
            audioReceiver = vc.receiver;
            audioReceiver.speaking.on('start', (uid) => {
              if (uid == OWNER_ID) {
                console.log('OWNER IS SPEAKING!');
                audioReceiveStream = audioReceiver.subscribe(uid, {
                  end: {
                    behavior: EndBehaviorType.AfterSilence,
                    duration: 100,
                  },
                });

                const recordingPath =
                  __dirname + `/../recordings/${Date.now()}.pcm`;

                const writeStream = fs.createWriteStream(recordingPath);

                const opusDecoder = new prism.opus.Decoder({
                  frameSize: 960,
                  channels: 2,
                  rate: 48000,
                });
                var streamToFFMPEG = audioReceiveStream
                  .pipe(opusDecoder)
                  .pipe(writeStream);
              }
            });
          }
        } catch (error) {
          console.error(`[ERROR] Error creating readable!`);
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
