import { ButtonInteraction } from "discord.js"
import { postJob } from "../modules/f"
import { jobTypes } from "../modules/data"

export const data = {
    customId: 'button_post_paid',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    postJob(interaction, jobTypes.paidJob)
    return
}