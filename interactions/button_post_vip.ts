import { ButtonInteraction } from "discord.js"
import { jobTypes } from "../modules/data"
import { postJob } from "../modules/f"

export const data = {
    customId: 'button_post_vip',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    postJob(interaction, jobTypes.vipJob)
    return
}