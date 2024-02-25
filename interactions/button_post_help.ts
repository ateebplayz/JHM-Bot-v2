import { ButtonInteraction } from "discord.js"
import { TOP_TO_RIGHT_EMOJI } from "../modules/data"

export const data = {
    customId: 'button_post_help',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    interaction.reply({
        content: `${TOP_TO_RIGHT_EMOJI} If you're experiencing any issues or need to report something, here is our support server.\n\nhttps://discord.gg/jobs-hiring-market-business-freelancing-jobs-smma-1024730510880165968`,
        ephemeral: true
    })
    return
}