import discord, { ForumChannel } from 'discord.js'
import { ErrorEmbed, InfoEmbed } from '../modules/embeds';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { footer } from '../modules/embeds'
import { CommandOptions } from '../modules/types';
import { deletePost, getPost } from '../modules/db';
import { jobTypes } from '../modules/data';
import { channels } from '..';
import { closePost } from '../modules/f';

export const data = new SlashCommandBuilder()
    .setName('close-post')
    .setDescription('Closes a post. You must own the post.')
    .addStringOption(option => option.setName('id').setDescription('The ID of the post you wish to close.').setRequired(true))
export const options: CommandOptions = {
    cooldown: 10000,
    permissionLevel: 'all'
}

export async function execute(interaction:CommandInteraction) {
    await interaction.deferReply({ephemeral: true})
    const member = await interaction.guild?.members.fetch(interaction.user)
    const postId = (interaction as ChatInputCommandInteraction).options.getString('id', true)
    const post = await getPost(postId)
    if(post) {
        if(post.creatorId !== interaction.user.id) {
            if(!(member?.permissions.has(PermissionFlagsBits.Administrator))) {
                const embed = new ErrorEmbed('No permission', `You are not the owner of this post. Thus you cant edit this post!`)
                return interaction.editReply({embeds: [embed]})
            } else {
                await closePost(post)
                return interaction.editReply(`Successfully deleted post with ID ${post.id}`)
            }
        } else {
            await closePost(post)
            await deletePost(post.id)
            return interaction.editReply(`Successfully deleted post with ID ${post.id}`)
        }
    } else {
        const embed = new ErrorEmbed('Unknown Post', `The post with ID **${postId}** was not found. Are you sure you entered the correct ID?`)
        return interaction.editReply({embeds: [embed]})
    }
    return
}