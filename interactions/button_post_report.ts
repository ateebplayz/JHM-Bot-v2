import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { getLogEmbed } from "../modules/helpers"
import { channels } from ".."
import { getPost } from "../modules/db"
import { InfoEmbed } from "../modules/embeds"

export const data = {
    customId: 'button_post_report',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    let msg = interaction.message
    let msgEmbed = msg.embeds[0]
    const reason = new TextInputBuilder().setCustomId('text_post_reason_reject').setLabel('Reason for Report').setRequired(true).setStyle(TextInputStyle.Paragraph).setPlaceholder('Reason for Rejection')
    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reason)
    const modal = new ModalBuilder().setCustomId('modal_post_report_' + interaction.id).setTitle('Post Report Reason').addComponents(actionRow)
    await interaction.showModal(modal)
    const filter = (interaction: any) => interaction.customId === modal.data.custom_id
    await interaction.awaitModalSubmit({filter, time: 6000_00}).then(async (mI) => {
        await mI.deferReply({ephemeral: true})
        let post = await getPost(msgEmbed.footer?.text || '')
        try {
            if(post) {
                const embed = new InfoEmbed('⚠️  Post Report!', 
                    `
                        <:angle_jhm:1195349952679915592>Reported By:
                        \n
                        <:divider_jhm:1195349961483759628>User ID: ${interaction.user.id}
                        <:divider_jhm:1195349961483759628>User Tag: <@!${interaction.user.id}>
                        \n
                        Post Owner:
                        \n
                        <:divider_jhm:1195349961483759628>User ID: ${post.creatorId}
                        <:divider_jhm:1195349961483759628>User Tag: <@!${post.creatorId}> 
                        \n
                        <:angle_jhm:1195349952679915592> Post ID: ${post.id}
                        <:angle_jhm:1195349952679915592> Post link: ${post.stats.message.url}
                        \n
                        <:angle_jhm:1195349952679915592> Reason: ${mI.fields.getField('text_post_reason_reject').value || ''}
                    `);
                (channels.reportLog as TextChannel).send({embeds: [embed]})
            }
        } catch {console.log}
        mI.editReply({content: 'The post has been reported, and our moderation team will investigate.'})
    }).catch(console.log).finally(() => {return})
    return
}