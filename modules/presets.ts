import discord from 'discord.js'
import { InfoEmbed } from './embeds'
import { channelIds, jobTypes } from './data'
export function getMainEmbed(isMsg: boolean, ephemeral?: boolean) {
    const paidJob = new discord.ButtonBuilder()
        .setCustomId('button_post_paid')
        .setLabel(jobTypes.paidJob.label)
        .setStyle(discord.ButtonStyle.Primary)
        .setEmoji({name: '💼'})
    const commissionJob = new discord.ButtonBuilder()
        .setCustomId('button_post_commission')
        .setLabel(jobTypes.commissionJob.label)
        .setStyle(discord.ButtonStyle.Primary)
        .setEmoji({name: '💰'})
    const forHireAd = new discord.ButtonBuilder()
        .setCustomId('button_post_forhire')
        .setLabel(jobTypes.forHireAd.label)
        .setStyle(discord.ButtonStyle.Primary)
        .setEmoji({name: '👷'})
    const unpaidJob = new discord.ButtonBuilder()
        .setCustomId('button_post_unpaid')
        .setLabel(jobTypes.unpaidJob.label)
        .setStyle(discord.ButtonStyle.Primary)
        .setEmoji({name: '🤝'})
    const VIPONLYLINE = new discord.ButtonBuilder()
        .setCustomId('button_disabled')
        .setLabel('---------------------[VIP ONLY]---------------------')
        .setStyle(discord.ButtonStyle.Secondary)
        .setDisabled(true)
    const specialPost = new discord.ButtonBuilder()
        .setCustomId('button_post_vip')
        .setLabel(jobTypes.vipJob.label)
        .setStyle(discord.ButtonStyle.Primary)
        .setEmoji({name: '💎'})
    const row = new discord.ActionRowBuilder<discord.ButtonBuilder>()
        .addComponents(paidJob, commissionJob)
    const row2 = new discord.ActionRowBuilder<discord.ButtonBuilder>()
        .addComponents(forHireAd, unpaidJob)
    const row3 = new discord.ActionRowBuilder<discord.ButtonBuilder>()
        .addComponents(VIPONLYLINE)
    const row4 = new discord.ActionRowBuilder<discord.ButtonBuilder>()
        .addComponents(specialPost)

    const embed = new InfoEmbed('<:white_info:1142840597745520762>⠀Marketplace Information⠀<:white_info:1142840597745520762>', `⠀\n\
    Discover a thriving freelance ecosystem at Jobs & Hiring, Market. Connect with clients, access projects, and elevate your freelancing journey with expert insights and a supportive community.\n\
    \n\
    \n\
    <:flecha11:1141389220863299655>⠀<#${channelIds.paidJob}>: Employers hire workers, paying for necessary tasks, which helps both. Workers earn money and bosses get work done.\n\
    \n\
    <:flecha11:1141389220863299655>⠀<#${channelIds.unpaidJob}>: People do tasks without getting paid to learn, grow, or help others, supporting their growth and offering assistance.\n\
    \n\
    <:flecha11:1141389220863299655>⠀<#${channelIds.forHireJob}>: Skilled professionals offer their services for hire, showing expertise and talents in a dedicated section.\n\
    \n\
    <:flecha11:1141389220863299655>⠀<#${channelIds.commissionJob}>: Workers earn a portion from sales, added to their base pay, reflecting a slice of each sale's earnings.\n\
    \n\
    <:flecha11:1141389220863299655> <#${channelIds.vipJob}> is for VIP users only. Whether you're recruiting in large numbers or seeking top-notch talent, this channel ensures a quick and efficient response for your agency or company.
    \n\n
    ⠀\n\
    <:bullet:1139565912568111148>⠀For detailed information, check: <#1200833388957945907>`)
        .setTitle('<:white_info:1142840597745520762>⠀Marketplace Information⠀<:white_info:1142840597745520762>')
        .setImage('https://images-ext-1.discordapp.net/external/i6zbYkJhC2bvSoELqxUjMdHrj5leUI_WT8IrootrtQk/https/i.ibb.co/kgsRHJn/JHM-Banner.png?format=webp&quality=lossless')
        .setFooter(null)
    const reply = {
        embeds: [embed],
        components: [row,row2,row3,row4]
    }
    if(ephemeral) (reply as discord.InteractionReplyOptions).ephemeral = true
    if(isMsg) return (reply as discord.MessageCreateOptions)
    return reply
}