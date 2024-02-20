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
        if(member.roles.cache.has(roleIds.vip)) {
            postJob(interaction, jobTypes.vipJob)
        } else {
            return interaction.reply({content: `This feature is exclusively for VIP users. If you're interested, purchase the VIP subscription at <#1197513765734842388>`, ephemeral: true})
        }
    }
    return
}