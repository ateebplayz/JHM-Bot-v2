import { ButtonInteraction, TextChannel, ThreadChannel } from "discord.js"
import { getPost, updateBump } from "../modules/db"
import { bumpCooldown } from "../modules/data"
import { channels } from ".."
import { getLogEmbed } from "../modules/helpers"

export const data = {
    customId: 'button_post_bump',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ephemeral:true})
    try {
        const post = await getPost((await (interaction.channel as ThreadChannel).messages.fetch()).last()?.embeds[0].footer?.text || 'XXXX-XXXX-XXXX')
        if(post) {
            if(interaction.user.id !== post.creatorId) return interaction.editReply({content: 'You are not the owner of this post. You may not bump this post.'})
            const timerStart = Date.now()
            if(timerStart - post.stats.times.bumped > bumpCooldown) {
                if(!(post.stats.flags.checked)) {
                    await updateBump(post.id);
                    const bumpLogPost = getLogEmbed(post.creatorId, post.category, interaction.user.id, post.stats.message.url, true, 'Post Bumped!');
                    try {
                        (channels.sendLogs as TextChannel).send({embeds: [bumpLogPost]})
                        interaction.channel?.send({content: 'Bumped Post!'}).then((msg) => {msg.delete()})
                    } catch {console.log}
                    return interaction.editReply({content:'Your post has been successfully bumped'})
                }
            } else {
                return interaction.editReply({content: `You may bump this post <t:${Number((Date.now()/1000) + (129600 - ((timerStart - post.stats.times.bumped)/1000))).toFixed(0)}:R>.`})
            }
        }
    } catch {console.log}
    return
}