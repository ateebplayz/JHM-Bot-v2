import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, italic } from "discord.js";
import { Job, Post, jobType } from "./types";
import { generateRandomKey, getEmbedJob, getModal, sendPost } from "./helpers";
import { jobs, roleIds } from "./data";
import { ErrorEmbed, InfoEmbed, SuccessEmbed } from "./embeds";
import { addPost } from "./db";

export async function postJob(interaction: ButtonInteraction, jobType: jobType) {
    let brk = false
    const member = await interaction.guild?.members.fetch(interaction.user)
    if(!member) return
    let post: Post = {
        id: generateRandomKey(),
        category: 0,
        creatorId: interaction.user.id,
        type: jobType.value,
        info: {
            title: "N/A",
            desc: "N/A",
            budget: "N/A",
            deadline: "N/A",
            location: "N/A",
            portfolio: "N/A"
        },
        stats: {
            approved: false,
            times: {
                creation: Date.now(),
                bumped: Date.now()
            },
            flags: {
                checked: false
            },
            message: {
                id: "N/A",
                url: "N/A"
            },
            premium: false
        }
    }
    if(member.roles.cache.has(roleIds.premium) || member.roles.cache.has(roleIds.vip)) post.stats.premium = true
    const modal = getModal(jobType, interaction.id)
    await interaction.showModal(modal)
    let ix: Message<boolean>|undefined;
    const filter = (interaction: any) => interaction.customId === modal.data.custom_id
    await interaction.awaitModalSubmit({filter, time: 6000_00})
        .then(async (modalInteraction) => {
            await modalInteraction.deferReply({ephemeral: true})
            modalInteraction.fields.fields.forEach((value, key) => {
                switch(value.customId) {
                    case 'jobTitleText':
                        if(!(value.value == '')) post.info.title = value.value
                        break
                    case 'jobDescText':
                        if(!(value.value == '')) post.info.desc = value.value
                        break
                    case 'jobPortfolioText':
                        if(value.value.toLowerCase().startsWith('http')){
                            if(!(value.value == '')) post.info.portfolio = value.value
                        } else {
                            brk = true;
                            modalInteraction.editReply({content: 'Your portfolio link must begin with either http or https'})
                            return
                        }
                        break
                    case 'jobBudgetText':
                        if(!(value.value == '')) post.info.budget = value.value
                        break
                    case 'jobCommissionText':
                        if(!(value.value == '')) post.info.budget = value.value
                        break
                    case 'jobDeadlineText':
                        if(!(value.value == '')) post.info.deadline = value.value
                        break
                    case 'jobLocationText':
                        if(!(value.value == '')) post.info.location == value.value
                        break
                }
            })
            const dropdown = new StringSelectMenuBuilder()
                .setCustomId('jobTypeDrop')
                .setPlaceholder('Select your Job Type')
            jobs.map((job: Job) => {
                dropdown.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(job.label)
                        .setEmoji({name: job.emoji})
                        .setValue(`${job.value}`)
                )   
            })
            const category = new InfoEmbed(`Select Post Category`, 'Please Select Your Post Category from down below')
            const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(dropdown)
            if(!brk) {
                ix = await modalInteraction.editReply({embeds: [category], components: [actionRow]})
            } else return
            
        })
        .catch(console.log)
    
    try {
        let x: Message<boolean> | undefined;
        ix?.awaitMessageComponent<ComponentType.StringSelect | ComponentType.Button>({time: 10000_000}).then(async (i) => {
            if(i.isAnySelectMenu()) {
                if(i.customId == 'jobTypeDrop') {
                    await i.deferReply({ephemeral: true})
                    post.category = (parseInt(i.values.join('')))
                    const embed = getEmbedJob(post)

                    const confirmBtn = new ButtonBuilder().setCustomId('confirmPost').setLabel('Confirm').setStyle(ButtonStyle.Success)
                    const cancelBtn = new ButtonBuilder().setCustomId('cancelPost').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
                    
                    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmBtn, cancelBtn)

                    x = await i.editReply({embeds: [embed], components: [actionRow]})
                    return
                }
            }
        }).then(() => {
            x?.awaitMessageComponent<ComponentType.Button>({time: 1000_000}).then(async (i) => {
                if(i.customId == 'confirmPost') {
                    await i.deferReply({ephemeral: true})
                    await addPost(post)
                    try {
                        sendPost(post)
                        if(post.stats.premium) {
                            const embed = new SuccessEmbed('Posted!', 'Your post **'+ post.info.title + '** has been posted successfully!')
                            i.editReply({embeds: [embed]})
                        } else {
                            const embed = new InfoEmbed('Sent for Approval!', 'Your post **'+ post.info.title + '** has been sent for approval and will be approved or rejected by one of our moderators!')
                            i.editReply({embeds: [embed]})
                        }
                    } catch {console.log}
                } else if(i.customId == 'cancelPost') {
                    await i.deferReply({ephemeral: true})
                    const byeEmbed = new ErrorEmbed('Goodbye', 'We are sad to see you go. :wave:')
                    return i.editReply({embeds: [byeEmbed]})
                }
            }).finally(()=>{return})
        }).finally(()=>{return})
    } catch {console.log}
}