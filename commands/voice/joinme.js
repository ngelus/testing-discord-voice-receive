const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joinme')
    .setDescription(
      'Joins the voice channel the member this command was run by is currently connected to.'
    ),
  async execute(interaction) {
    try {
      const vc = joinVoiceChannel({
        channelId: interaction.member.voice.channelId,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: false,
      });
    } catch (error) {
      console.error(
        `[ERROR] Error joining ${interaction.member.voice.channel.name}!`
      );
      console.error(error);
    }

    await interaction.reply('Okay!');
  },
};
