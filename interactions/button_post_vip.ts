import { ButtonInteraction } from "discord.js"
import { jobTypes, roleIds } from "../modules/data"
import { postJob } from "../modules/f"
import { ErrorEmbed } from "../modules/embeds"

export const data = {
    customId: 'button_post_vip',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const member = await interaction.guild?.members.fetch(interaction.user)
    if(member) {
        if(member.roles.cache.has(roleIds.premium) || member.roles.cache.has(roleIds.vip)) {
            postJob(interaction, jobTypes.vipJob)
        } else {
            const embed = new ErrorEmbed('No permission', `You need to have the VIP or Premium role in order to create a special post!`)
            return interaction.reply({embeds: [embed], ephemeral: true})
        }
    }
    return
}