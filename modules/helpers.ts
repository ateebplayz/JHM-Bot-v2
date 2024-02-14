import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ForumChannel, GuildMember, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import { CARD_EMOJI, CARD_PREMIUM_EMOJI, CLOCK_EMOJI, CLOCK_PREMIUM_EMOJI, COMMISSION_JOB_BANNER_URL, DESCRIPTION_EMOJI, DESCRIPTION_PREMIUM_EMOJI, FOR_HIRE_BANNER_URL, ID_EMOJI, ID_PREMIUM_EMOJI, INVISIBLE_CHARACTER, JHMColor, JHMColorPremium, JHM_LOGO_URL, JobTypeKeys, PAID_JOB_BANNER_URL, PERSON_EMOJI, PERSON_PREMIUM_EMOJI, PREMIUM_COMMISSION_JOB_BANNER_URL, PREMIUM_FOR_HIRE_BANNER_URL, PREMIUM_PAID_JOB_BANNER_URL, PREMIUM_UNPAID_JOB_BANNER_URL, TOP_TO_RIGHT_EMOJI, TOP_TO_RIGHT_PREMIUM_EMOJI, UNPAID_JOB_BANNER_URL, jobTypes, jobs, logExtraData, roleIds } from "./data";
import { Job, Post, jobType } from "./types";
import { ErrorEmbed, InfoEmbed, SuccessEmbed } from "./embeds";
import discord from 'discord.js'
import { channels } from "..";
import { updateApproval, updateMessage } from "./db";
export function checkVipStatus(member: GuildMember | undefined) {
    if(!member) return false
    if(member.roles.cache.has(roleIds.vip) || member.roles.cache.has(roleIds.premium)) {return true} else return false;
}
export function generateRandomKey(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 12; // Total length including hyphens
    let randomKey = '';
    
    for (let i = 0; i < length; i++) {
        if (i > 0 && i % 5 === 0) { // Insert hyphen at every 5th position (0-indexed)
            randomKey += '-';
        } else {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomKey += characters.charAt(randomIndex);
        }
    }
    
    return randomKey;
}
export function getModal(jobType: jobType, interactionId: string) {
    let value = jobType.value
    let modal = new ModalBuilder()
    let textInputs: Array<TextInputBuilder> = []
    let actionRow: ActionRowBuilder<TextInputBuilder>
    const jobTitleText = new TextInputBuilder()
        .setCustomId('jobTitleText')
        .setLabel('Job Title')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(128)
        .setRequired(true)
    if(value == jobTypes.forHireAd.value) {
        jobTitleText.setPlaceholder("What service are you offering?") 
    } else jobTitleText.setPlaceholder("What's this job about?")
    const jobDescText = new TextInputBuilder()
        .setCustomId('jobDescText')
        .setLabel('Job Description')
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(2048)
        .setRequired(true)
    if(value == jobTypes.forHireAd.value) {
        jobDescText.setPlaceholder("Please share detail about what you're offering. Tell us about your skills, experience and past work.")
    } else jobDescText.setPlaceholder("Please share job details like responsibilities, experience or any specific qualifications or skills.")
    const jobPortfolioText = new TextInputBuilder()
        .setCustomId('jobPortfolioText')
        .setLabel('Your Portfolio')
        .setPlaceholder("Share Your portfolio link or previous work.")
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(128)
        .setRequired(true)
    const jobBudgetText = new TextInputBuilder()
        .setCustomId('jobBudgetText')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(128)
        .setRequired(true)
    if(value == jobTypes.forHireAd.value) {
        jobBudgetText.setLabel('Payment Method')
        jobBudgetText.setPlaceholder("What's your preferred payment method?")
    } else {
        jobBudgetText.setLabel('Job Budget')
        jobBudgetText.setPlaceholder("What's your budget for this job?")
    }
    const jobCommissionText = new TextInputBuilder()
        .setCustomId('jobCommissionText')
        .setLabel('Payment')
        .setPlaceholder("What percentage of commission will you give?")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(128)
        .setRequired(true)
    const jobDeadlineText = new TextInputBuilder()
        .setCustomId('jobDeadlineText')
        .setLabel('Job Deadline')
        .setPlaceholder("Enter a deadline for your job.")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(128)
        .setRequired(false)
    const jobLocationText = new TextInputBuilder()
        .setCustomId('jobLocationText')
        .setLabel('Preferred Location')
        .setPlaceholder("Tell your preferred work location (country/region).")
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(52)
        .setRequired(false)

    switch(value) {
        case jobTypes.commissionJob.value:
            textInputs= [jobTitleText, jobDescText, jobBudgetText, jobDeadlineText]
            break
        case jobTypes.forHireAd.value:
            textInputs= [jobTitleText, jobDescText, jobPortfolioText, jobBudgetText]
            break
        case jobTypes.paidJob.value:
            textInputs= [jobTitleText, jobDescText, jobBudgetText, jobDeadlineText, jobLocationText]
            break
        case jobTypes.unpaidJob.value:
            textInputs= [jobTitleText, jobDescText, jobDeadlineText]
            break
        case jobTypes.vipJob.value:
            textInputs= [jobTitleText, jobDescText, jobBudgetText, jobDeadlineText]
            break
    }
    textInputs.map((textInput) => {
        actionRow = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(textInput)
        modal.addComponents(actionRow)
    })
    modal.setCustomId(getModalCustomId(jobType.name+'_'+interactionId))
    modal.setTitle(`Post a ${jobType.name}`)
    return modal
}
export function getModalCustomId(name: string) {
    return name.toLowerCase().replace(/\s+/g, '_') + '_modal'
}
export function getEmbedJob(post: Post) {
    let premium = post.stats.premium
    let imgUri = ''
    let color = JHMColor
    if(premium) color = JHMColorPremium
    switch(post.type) {
        case 1:
            if(premium) {
                imgUri = PREMIUM_PAID_JOB_BANNER_URL
            } else {
                imgUri = PAID_JOB_BANNER_URL
            }
            break;
        case 2:
            if(premium) {
                imgUri = PREMIUM_COMMISSION_JOB_BANNER_URL
            } else {
                imgUri = COMMISSION_JOB_BANNER_URL
            }
            break;
        case 3:
            if(premium) {
                imgUri = PREMIUM_FOR_HIRE_BANNER_URL
            } else {
                imgUri = FOR_HIRE_BANNER_URL
            }
            break;
        case 4:
            if(premium) {
                imgUri = PREMIUM_UNPAID_JOB_BANNER_URL
            } else {
                imgUri = UNPAID_JOB_BANNER_URL
            }
            break;
        case 5:
            if(premium) {
                imgUri = PREMIUM_PAID_JOB_BANNER_URL
            } else {
                imgUri = ''
            }
            break;
    }
    const embed = new InfoEmbed(
      `${premium ? PERSON_PREMIUM_EMOJI: PERSON_EMOJI} ${post.info.title}`,
      `${INVISIBLE_CHARACTER}\n${premium ? DESCRIPTION_PREMIUM_EMOJI : DESCRIPTION_EMOJI} **Description**\n ${premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} ${post.info.desc}\n${INVISIBLE_CHARACTER}`,
    ).setColor(color).setImage(imgUri)
    if(post.category == jobTypes.paidJob.value || post.category == jobTypes.commissionJob.value || post.category == jobTypes.vipJob.value) embed.addFields({ name: `${premium ? CLOCK_PREMIUM_EMOJI : CLOCK_EMOJI} ${post.type == jobTypes.forHireAd.value ? '**Payment Method**' : '**Budget**'}`, value: `${premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} ${post.info.budget}`, inline: true });
    if (post.category == jobTypes.paidJob.value || post.category == jobTypes.commissionJob.value || post.category == jobTypes.unpaidJob.value || post.category == jobTypes.vipJob.value) embed.addFields({ name: `${premium ? CLOCK_PREMIUM_EMOJI : CLOCK_EMOJI} **Deadline**`, value: `${ premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} ${post.info.deadline}`, inline: true });
    if (post.category == jobTypes.paidJob.value) embed.addFields({ name: `${premium ? ID_PREMIUM_EMOJI : ID_EMOJI} **Location**`, value: `${ premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} ${post.info.location}`, inline: true });
    if (post.category == jobTypes.forHireAd.value) embed.addFields({ name: `${premium ? ID_PREMIUM_EMOJI : ID_EMOJI} **Portfolio**`, value: `${ premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} ${post.info.portfolio}`, inline: true });
    if(post.type == jobTypes.forHireAd.value) {
        if (post.creatorId !== 'N/A') embed.addFields({ name: `${premium ? PERSON_PREMIUM_EMOJI : PERSON_EMOJI} **Freelancer**`, value: `${ premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} <@${post.creatorId}>`, inline: true });
    } else {
        if (post.creatorId !== 'N/A') embed.addFields({ name: `${premium ? PERSON_PREMIUM_EMOJI : PERSON_EMOJI} **Client**`, value: `${ premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} <@${post.creatorId}>`, inline: true });
    }
    embed.setFooter({text: `${post.id}`, iconURL: JHM_LOGO_URL});
    return embed;
}
export function getLogEmbed(author: string, type: number, moderator: string, url: string, approved: boolean, title: string, reason?: string) {
    if(approved) {
        const embed = new SuccessEmbed(`${title}`, `**Posted By**: <@!${author}> (${author})\n**Post Type**: ${getLabelByValue(type)}\n**Approved By**: <@!${moderator}> (${moderator})\n**Post Link**: ${url}`)
        return embed
    } else {
        const embed = new ErrorEmbed(`${title}`, `**Posted By**: <@!${author}> (${author})\n**Rejected By**: <@!${moderator}> (${moderator})\n**Reason**: ${reason || ''}`)
        return embed
    }
}
  /* export function getLogEmbed(user: BotUser, post: Post, premium: boolean, imgUri: string, color: number) {
    const embed = new PostEmbed(
      `${premium ? PERSON_PREMIUM_EMOJI : PERSON_EMOJI} ${post.jobTitle}`,
      `${INVISIBLE_CHARACTER}\n${premium ? DESCRIPTION_PREMIUM_EMOJI : DESCRIPTION_EMOJI} **Description**\n ${premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} ${post.jobDesc}\n${INVISIBLE_CHARACTER}`,
      color,
      imgUri,
    );
    if (post.jobBudget !== '') embed.addFields({ name: `${premium ? CARD_PREMIUM_EMOJI : CARD_EMOJI} ${post.jobType == 3 ? '**Payment Method**' : '**Budget**'}`, value: `${premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} ${post.jobBudget}`, inline: true });
    if (post.jobDeadline !== '') embed.addFields({ name: `${premium ? CLOCK_PREMIUM_EMOJI : CLOCK_EMOJI} **Deadline**`, value: `${premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} ${post.jobDeadline}`, inline: true });
    if (post.jobLocation !== '') embed.addFields({ name: `${premium ? ID_PREMIUM_EMOJI : ID_EMOJI} **Preferred Location**`, value: `${premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} ${post.jobLocation}`, inline: true });
    if (post.jobPortfolio !== '') embed.addFields({ name: `${premium ? ID_PREMIUM_EMOJI : ID_EMOJI} **Portfolio**`, value: `${premium ? TOP_TO_RIGHT_PREMIUM_EMOJI : TOP_TO_RIGHT_EMOJI} ${post.jobPortfolio}`, inline: true })
    embed.addFields({name: 'User Info', value: `**User** : <@${user.userId}>\n**User ID** : ${user.userId}\n**Type** : ${getNameByValue(post.jobType)}\n**Category** : ${getLabelByValue(post.job)}`})
    embed.setFooter({text:post.jobId || 'N/A'})
    return embed
  } */

export async function sendPost(post: Post) {
    let channel: discord.Channel | null | undefined;
    let channelType: 'Forum' | 'Text' = 'Forum'
    switch(post.type) {
        case jobTypes.commissionJob.value:
            channel = channels.commissionJob
            break
        case jobTypes.forHireAd.value:
            channel = channels.forHireJob
            break
        case jobTypes.paidJob.value:
            channel = channels.paidJob
            break
        case jobTypes.unpaidJob.value:
            channel = channels.unpaidJob
            break
        case jobTypes.vipJob.value:
            channel = channels.vipJob
            break
    }
    if(post.type == jobTypes.vipJob.value) channelType = 'Text'

    const applyBtn = new ButtonBuilder().setCustomId('button_post_apply').setLabel('Apply').setEmoji('📝').setStyle(ButtonStyle.Success)
    const reportBtn = new ButtonBuilder().setCustomId('button_post_report').setLabel('Report').setEmoji('🚨').setStyle(ButtonStyle.Danger)

    if(post.type == jobTypes.forHireAd.value) applyBtn.setLabel('Hire')

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(applyBtn,reportBtn)

    const embed = getEmbedJob(post)
    let msg;
    if(post.stats.premium) {
        if(channelType == 'Forum') {
            let tags: Array<string> = [];
            (channel as ForumChannel).availableTags.map(tag => {
                if(tag.name === getLabelByValue(post.category)) {
                    tags.push(tag.id)
                }
            })
            const bumpBtn = new ButtonBuilder().setCustomId('button_post_bump').setEmoji('🚀').setLabel('Bump').setStyle(ButtonStyle.Primary)
            const bumpBtnRow = new ActionRowBuilder<ButtonBuilder>().addComponents(bumpBtn)
            msg = await (channel as ForumChannel).threads.create({name: '[' + getLabelByValue(post.category) + '] ' + post.info.title,message: {embeds: [embed], components: [actionRow]}, appliedTags: tags});
            (channel as ForumChannel).threads.fetch(msg.id).then(thread => {thread?.send({components: [bumpBtnRow]})})
            await updateMessage(post.id, {id: msg.id, url: msg.url})
            await updateApproval(post.id)
        } else if(channelType =='Text') {
            const ping = getPing(post.category)
            msg = await (channel as TextChannel).send({content: ping, embeds: [embed], components: [actionRow]})
            await updateMessage(post.id, {id: msg.id, url: msg.url})
            await updateApproval(post.id)
        }
    } else {
        const approveBtn = new ButtonBuilder().setCustomId('button_post_approve').setLabel('Approve').setStyle(ButtonStyle.Success);
        const rejectBtn = new ButtonBuilder().setCustomId('button_post_reject').setLabel('Reject').setStyle(ButtonStyle.Danger);
        const actionRow = new ActionRowBuilder<ButtonBuilder>().setComponents(approveBtn, rejectBtn);
        try {
            (channels.jobApproval as TextChannel).send({embeds: [embed.addFields(logExtraData(post))], components: [actionRow]});
        } catch {console.log}
    }
    return
}

export const getLabelByValue = (value: number) => {
    const job = jobs.find((job: Job) => job.value === value)
    return job?.label
}
export function getPing(jobType: number) {
    const job = jobs.find((job: Job) => job.value === jobType)
    return `Notification <@&${job?.role}>`
}
export const getNameByValue = (value: number) => {
    const keys = Object.keys(jobTypes) as JobTypeKeys[];
    const matchedKey = keys.find(key => jobTypes[key].value === value);
    return matchedKey ? jobTypes[matchedKey].name : undefined;
}