import { ButtonInteraction } from "discord.js"

export const data = {
    customId: 'button_ask_yes',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    interaction.reply(`Alright! Remember, your post will be automatically deleted after 4 days of original creation.`)
    return
}