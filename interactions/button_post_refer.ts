import { ActionRowBuilder, ButtonInteraction, UserSelectMenuBuilder } from "discord.js"
import { InfoEmbed } from "../modules/embeds"

export const data = {
    customId: 'button_post_refer',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ephemeral: true})
    const msg = interaction.message
    if(msg) {
        let postId = msg.embeds[0].footer
        if(postId) {
            const embed = new InfoEmbed('Refer Post', `Refer a user to this paid post. Please select a user from the dropdown below.`).setFooter(postId)
            const dropdown = new UserSelectMenuBuilder().setCustomId('dropdown_post_refer').setPlaceholder('Select a User').setMaxValues(1)
            const actionRow = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(dropdown)
            interaction.editReply({embeds: [embed], components: [actionRow]})
        } else {interaction.editReply(`An error occured`)}
    } else {interaction.editReply(`An error has occured`)}
    return
}