import { ButtonInteraction } from "discord.js"
import { getPost } from "../modules/db"
import { getNameByValue } from "../modules/helpers"
import { jobTypes } from "../modules/data"

export const data = {
    customId: 'button_post_apply',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ephemeral: true})
    const postId = interaction.message.embeds[0].footer?.text || 'XXXX-XXXX-XXXX'
    try {
        const post = await getPost(postId)
        const member = await interaction.guild?.members.fetch(post?.creatorId || '')
        const name = getNameByValue(post?.type || 4)
        let txt = `${name}`
        if(post?.type !== jobTypes.forHireAd.value) {
            txt += ` opportunity`
        } 
        interaction.editReply({content: `The ${txt} has been posted by <@!${post?.creatorId}> (${member?.user.username}). To apply, please reach out directly to their DMs.`})
    } catch {console.log}
    return
}