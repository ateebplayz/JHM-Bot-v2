import { ErrorEmbed, InfoEmbed, SuccessEmbed, WarnEmbed } from '../modules/embeds';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, TextChannel } from 'discord.js';
import { footer } from '../modules/embeds'
import { CommandOptions } from '../modules/types';
import { channels } from '..';

export const data = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a User. Moderator & Admin only!')
    .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The user action').setRequired(true))
export const options: CommandOptions = {
    cooldown: 10000,
    permissionLevel: 'mod'
}

export async function execute(interaction:CommandInteraction) {
    await interaction.deferReply({ephemeral: true})
    const user = interaction.options.getUser('user')
    const reason = (interaction as ChatInputCommandInteraction).options?.getString('reason') || 'No Reason Provided'
    if(interaction.user.id === user?.id) return interaction.editReply({content: `You can't warn yourself`})
    if(user?.bot) return interaction.editReply({content: `You can't warn a bot!`})
    const warnEmbeds = {
        user: new WarnEmbed(reason),
        local: new SuccessEmbed(`User ${user?.username} (${user?.id}) has been successfully warned`, 'Success!').addFields({name:'Reason', value: reason}),
        log: new ErrorEmbed('New Warning', `**User Warned**: <@!${user?.id}> (${user?.id})\n**Moderator**: <@!${interaction.user.id}>\n**Reason**: ${reason}`)
    }
    try {
        user?.send({embeds: [warnEmbeds.user]})
        interaction.editReply({embeds: [warnEmbeds.local]});
        (channels.warnLog as TextChannel).send({embeds: [warnEmbeds.log]})
    } catch (e) {
        interaction.editReply({content: `There was an error while doing this command`})
    }
    return
}