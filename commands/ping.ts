import { InfoEmbed } from '../modules/embeds';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js';
import { footer } from '../modules/embeds'
import { CommandOptions } from '../modules/types';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
export const options: CommandOptions = {
    cooldown: 10000,
    permissionLevel: 'all'
}

export async function execute(interaction:CommandInteraction) {
    await interaction.deferReply()
    const receivePing = interaction.client.ws.ping
    const time1 = Date.now()
    const postPing = Date.now() - time1

    const embed = new InfoEmbed('Ping results', 'Results displayed are estimated.')
        .setTitle('Ping results')
        .setFooter(footer)
        .addFields({name:'Discord -> BOT', value:`${receivePing}ms - WS ping`}, {name:'BOT -> Discord', value:`${postPing}ms - HTTP ping`})
    const btn = new ButtonBuilder().setCustomId('button_delete').setLabel('Delete').setStyle(ButtonStyle.Danger)
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(btn)
    return interaction.editReply({embeds: [embed], components: [actionRow]})
}