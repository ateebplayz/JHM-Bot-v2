import discord, { ForumChannel } from 'discord.js'
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { deletePost, getPost, updateApproval, updateMessage } from "../modules/db"
import { getMainEmbed } from "../modules/presets"
import { jobTypes, logExtraData } from "../modules/data"
import { getEmbedJob, getLabelByValue, getLogEmbed, getPing } from "../modules/helpers"
import { channels } from ".."
import { ErrorEmbed, SuccessEmbed } from '../modules/embeds'

export const data = {
    customId: 'button_post_approve',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    let msg = interaction.message
    let msgEmbed = msg.embeds[0]
    let post = await getPost(msgEmbed.footer?.text || '')
    await interaction.deferReply({ephemeral: true})
    const approveBtn = new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('postX')
        .setLabel('Approved')
        .setStyle(ButtonStyle.Success)
    const rejectBtn = new ButtonBuilder()
        .setDisabled(true)
        .setCustomId('postX2')
        .setLabel('Reject')
        .setStyle(ButtonStyle.Secondary)
    const actionRow = new ActionRowBuilder<ButtonBuilder>().setComponents(approveBtn, rejectBtn)
    try {
        if(post) {
            msg.edit({embeds: [getEmbedJob(post).addFields(logExtraData(post))], components: [actionRow]})
            await updateApproval(post.id)
            const embed = getLogEmbed(post.creatorId, post.category, interaction.user.id, post.stats.message.url, true, 'Post Approved');
            (channels.jobApprovalLog as TextChannel).send({embeds: [embed]});
            const embed2 = getEmbedJob(post)
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
            if(post.type == jobTypes.vipJob.value) {channelType = 'Text'}
            let msg2;
            const applyBtn = new ButtonBuilder().setCustomId('button_post_apply').setLabel('Apply').setEmoji('📝').setStyle(ButtonStyle.Success)
            if(post.type == jobTypes.commissionJob.value || post.type == jobTypes.paidJob.value || post.type == jobTypes.unpaidJob.value) applyBtn.setEmoji('💼')
            const reportBtn = new ButtonBuilder().setCustomId('button_post_report').setLabel('Report').setEmoji('🚨').setStyle(ButtonStyle.Danger)
            const referBtn = new ButtonBuilder().setCustomId('button_post_refer').setLabel('Refer').setEmoji('🤝').setStyle(ButtonStyle.Secondary)

            if(post.type == jobTypes.forHireAd.value) applyBtn.setLabel('Hire')

            const actionRow2 = new ActionRowBuilder<ButtonBuilder>().addComponents(applyBtn,reportBtn)
            if(post.type == jobTypes.paidJob.value) actionRow2.addComponents(referBtn)
            if(channelType == 'Forum') {
                let tags: Array<string> = [];
                (channel as ForumChannel).availableTags.map(tag => {
                    if(tag.name === getLabelByValue(post?.category || 0)) {
                        tags.push(tag.id)
                    }
                })
                const bumpBtn = new ButtonBuilder().setCustomId('button_post_bump').setEmoji('🚀').setLabel('Bump').setStyle(ButtonStyle.Primary)
                const bumpBtnRow = new ActionRowBuilder<ButtonBuilder>().addComponents(bumpBtn)
                msg2 = await (channel as ForumChannel).threads.create({name: post.info.title,message: {embeds: [embed2],components:[actionRow2]}, appliedTags: tags});
                (channel as ForumChannel).threads.fetch(msg2.id).then(thread => {thread?.send({components: [bumpBtnRow]})})
            } else {
                const ping = getPing(post.category)
                msg2 = await (channel as TextChannel).send({content: ping, embeds: [embed2], components: [actionRow2]})
            }
            await updateMessage(post.id, {id: msg2.id, url: msg2.url})
            await updateApproval(post.id)
        }
    } catch {console.log}
    try {
        const member = interaction.guild?.members.fetch(post?.creatorId || '').then((mem) => {
            const embed = new SuccessEmbed('Post Approved', `Your post **${post?.info.title}** has been approved by one of our moderators. Congratulations! :partying_face:`)
            try {
                mem.send({embeds: [embed]})
            } catch {console.log}
        });
    }catch{console.error}
    interaction.editReply({content: 'Succesfully approved post ' + post?.id})
    return
}