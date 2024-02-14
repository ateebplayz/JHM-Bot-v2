import { ButtonInteraction } from "discord.js"

export const data = {
    customId: 'button_delete',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    if(interaction.message.deletable) interaction.message.delete()
    return
}