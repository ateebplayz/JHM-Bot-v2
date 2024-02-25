import { ButtonInteraction } from "discord.js"
import { deletePost, getPost } from "../modules/db"
import { closePost } from "../modules/f"

export const data = {
    customId: 'button_ask_no',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ephemeral: true})
    const postId = interaction.message.embeds[0].footer?.text
    const post = await getPost(postId || '')
    if(post) {
        await closePost(post)
        await deletePost(post.id)
        interaction.editReply(`<:done:1132644555834011748> Your post has been deleted. Thank you for using JHM.`)
    }
    return
}