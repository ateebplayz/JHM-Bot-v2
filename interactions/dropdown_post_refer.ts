import { ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuInteraction } from "discord.js"
import { InfoEmbed } from "../modules/embeds"
import { getPost } from "../modules/db"

export const data = {
    customId: 'dropdown_post_refer',
    type: 'component'
}
export async function execute(interaction: UserSelectMenuInteraction) {
    await interaction.deferReply({ephemeral: true})
    const userId = interaction.values[0]
    const user = await interaction.guild?.members.fetch(userId)
    const postId = interaction.message.embeds[0].footer?.text || ''
    const post = await getPost(postId)
    if(user?.user.bot) return interaction.editReply(`You can't send a referral to a bot`)
    try {
        if(post) {
            const embed = new InfoEmbed('You have been referred', `You have been referred to a post by <@!${interaction.user.id}>. You may click on the button below to go to this referral, or you may report this referral if you believe this is spam.`).setFooter({text:`${post.id}`}).setAuthor({name: interaction.user.id})
            const viewButton = new ButtonBuilder().setURL(post.stats.message.url).setLabel('Visit Post').setStyle(ButtonStyle.Link)
            const reportButton = new ButtonBuilder().setCustomId('button_refer_report').setLabel('Report').setStyle(ButtonStyle.Danger)
            const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(viewButton, reportButton)
            user?.send({
                embeds: [embed],
                components: [actionRow]
            })
            interaction.editReply(`Successfully sent a referral to <@!${user?.id}>`)
        }
    } catch {
        interaction.editReply(`This user has their DMs closed`)
    }
    return
}