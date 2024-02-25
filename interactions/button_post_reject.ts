import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { deletePost, getPost } from "../modules/db"
import { getMainEmbed } from "../modules/presets"
import { logExtraData } from "../modules/data"
import { getEmbedJob, getLogEmbed, sleep } from "../modules/helpers"
import { channels } from ".."
import { ErrorEmbed } from "../modules/embeds"

export const data = {
    customId: 'button_post_reject',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    let msg = interaction.message
    let msgEmbed = msg.embeds[0]
    const reason = new TextInputBuilder().setCustomId('text_post_reason_reject').setLabel('Reason for Rejection').setRequired(true).setStyle(TextInputStyle.Paragraph).setPlaceholder('Reason for Rejection')
    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reason)
    const modal = new ModalBuilder().setCustomId('modal_post_reject_' + interaction.id).setTitle('Post Rejection Reason').addComponents(actionRow)
    await interaction.showModal(modal)
    const filter = (interaction: any) => interaction.customId === modal.data.custom_id
    await interaction.awaitModalSubmit({filter, time: 6000_00}).then(async (mI) => {
        await mI.deferReply({ephemeral: true})
        const approveBtn = new ButtonBuilder()
            .setDisabled(true)
            .setCustomId('postX')
            .setLabel('Approve')
            .setStyle(ButtonStyle.Secondary)
        const rejectBtn = new ButtonBuilder()
            .setDisabled(true)
            .setCustomId('postX2')
            .setLabel('Rejected')
            .setStyle(ButtonStyle.Danger)
        const actionRow = new ActionRowBuilder<ButtonBuilder>().setComponents(approveBtn, rejectBtn)
        let post = await getPost(msgEmbed.footer?.text || '')
        try {
            if(post) {
                msg.edit({embeds: [getEmbedJob(post).addFields(await logExtraData(post))], components: [actionRow]})
                await deletePost(post.id)
                const embed = getLogEmbed(post.creatorId, post.category, mI.user.id, '', false, 'Post Rejected', mI.fields.getField('text_post_reason_reject').value);
                const member = interaction.guild?.members.fetch(post.creatorId).then((mem) => {
                    const embed = new ErrorEmbed('Post Rejected', `Your post **${post?.info.title}** has been Rejected!`).addFields({name: "Administrator's Reason", value: mI.fields.getField('text_post_reason_reject').value})
                    try {
                        mem.send({embeds: [embed]})
                    } catch {console.log}
                });
                (channels.jobApprovalLog as TextChannel).send({embeds: [embed]});
            }
        } catch {console.log}
        mI.editReply({content: 'Succesfully rejected post ' + post?.id})
        await deletePost(post?.id || '')
    }).catch(console.log).finally(() =>{})
    await sleep(120000)
    try {
        interaction.message.delete()
    } catch {console.log}
    return
}