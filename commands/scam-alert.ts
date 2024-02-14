import { InfoEmbed } from '../modules/embeds';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, TextChannel } from 'discord.js';
import { footer } from '../modules/embeds'
import { CommandOptions } from '../modules/types';
import { channels } from '..';

export const data = new SlashCommandBuilder()
    .setName('scam-alert')
    .setDescription('Report a Scam Scenario. Admin only!')
    .addStringOption(option => option.setName('username').setDescription('The user name of the user that is a scammer').setRequired(true))
    .addStringOption(option => option.setName('id').setDescription('The user id of the user that is a scammer').setRequired(true))
    .addStringOption(option => option.setName('desc').setDescription('The message that describes the users actions').setRequired(true))
    .addAttachmentOption(option => option.setName('image').setDescription('The image to send in the message').setRequired(true))
export const options: CommandOptions = {
    cooldown: 10000,
    permissionLevel: 'all'
}

export async function execute(interaction:CommandInteraction) {
    await interaction.deferReply({ephemeral: true})
    const msg = await (channels.scamChannel as TextChannel).send({content: `:warning: **Scam Alert**\n\nID: ${(interaction as ChatInputCommandInteraction).options.getString('id')}\nName: ${(interaction as ChatInputCommandInteraction).options.getString('username')}\n\n${(interaction as ChatInputCommandInteraction).options.getString('desc')}`, files: [(interaction as ChatInputCommandInteraction).options.getAttachment('image', true)]})
    interaction.editReply({content: `Succesfully sent Scam Report to the channel. Msg ID: ${msg.id} | ${msg.url}`})
    return
}