import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { getLogEmbed } from "../modules/helpers"
import { ErrorEmbed } from "../modules/embeds"
import { getPost } from "../modules/db"
import { channels } from ".."

export const data = {
    customId: 'button_refer_report',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const modal = new ModalBuilder().setCustomId(`refer_reason_modal_${interaction.id}`).setTitle('Report Referral')
    const reason = new TextInputBuilder().setCustomId('text_refer_reason').setLabel('Reason').setMaxLength(1000).setMinLength(10).setPlaceholder('Reason for Reporting this referral.').setStyle(TextInputStyle.Paragraph).setRequired(true)
    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reason)
    modal.setComponents(actionRow)  
    await interaction.showModal(modal)
    const postId = interaction.message.embeds[0].footer?.text
    const post = await getPost(postId || '')
    const filter = (interaction: any) => interaction.customId === modal.data.custom_id
    await interaction.awaitModalSubmit({filter, time: 60000_00}).then(async (mI) => { 
        await mI.deferReply({ephemeral: true})
        try {
            const userId = interaction.message.embeds[0].author?.name
            if(post) {
                const referReport = new ErrorEmbed(`Refer Report`, `**Author** : <@!${interaction.user.id}> (${interaction.user.id}) \n**Post Referred** : ${post.stats.message}\n**Post Referrer** : <@!${userId}> (${userId})`);
                (channels.reportLog as TextChannel).send({embeds: [referReport]})
            }
        } catch {console.log}
    }).catch(()=>{console.log})
    return
}