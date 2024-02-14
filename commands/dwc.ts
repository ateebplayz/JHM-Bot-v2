import { InfoEmbed } from '../modules/embeds';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, TextChannel } from 'discord.js';
import { footer } from '../modules/embeds'
import { CommandOptions } from '../modules/types';
import { channels } from '..';

export const data = new SlashCommandBuilder()
    .setName('dwc')
    .setDescription('Report a Deal-With-Caution Scenario. Admin only!')
    .addUserOption(option => option.setName('user').setDescription('The user that should be dealt with caution').setRequired(true))
    .addStringOption(option => option.setName('desc').setDescription('The message that describes the users actions').setRequired(true))
    .addAttachmentOption(option => option.setName('image').setDescription('The image to send in the message').setRequired(true))
export const options: CommandOptions = {
    cooldown: 10000,
    permissionLevel: 'admin'
}

export async function execute(interaction:CommandInteraction) {
    await interaction.deferReply({ephemeral: true})
    const userMentioned = interaction.options.getUser('user')
    const msg = await (channels.dwcChannel as TextChannel).send({content: `:warning: **Deal With Caution**\n\nID: ${userMentioned?.id}\nName: ${userMentioned?.username}\nMention: <@!${userMentioned?.id}>\n\n${(interaction as ChatInputCommandInteraction).options.getString('desc')}`,files: [(interaction as ChatInputCommandInteraction).options.getAttachment('image', true)]})
    interaction.editReply({content: `Succesfully sent DWC Report to the channel. Msg ID: ${msg.id} | ${msg.url}`})
    return
}