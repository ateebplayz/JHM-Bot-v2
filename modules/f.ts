import discord, { Client, Guild, TextChannel } from 'discord.js'
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, ForumChannel, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, italic } from "discord.js";
import { JHMClient, Job, Post, jobType } from "./types";
import { generateRandomKey, getEmbedJob, getLogEmbed, getModal, modifyEmbed, sendPost } from "./helpers";
import { bumpCooldown, cooldownTime, jobTypes, jobs, roleIds } from "./data";
import { ErrorEmbed, InfoEmbed, SuccessEmbed } from "./embeds";
import { addPost, deletePost, getPosts, getPostsPremium, updateBump, updateFlag } from "./db";
import { channels } from "..";

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
                        if(!(value.value == '')) post.info.portfolio = value.value
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
                        if(!(value.value == '')) post.info.location = value.value
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
                    addPost(post).then(() => {
                        try {
                            sendPost(post)
                            if(post.stats.premium) {
                                i.editReply({content: `<:check_yes:1069615466617770044> Your post has been automatically approved because of your premium status!`})
                            } else {
                                i.editReply({content: `<:check_yes:1069615466617770044> Your post has been sent in for approval. You will be notified when it goes through.`})
                            }
                        } catch {console.log}
                    })
                } else if(i.customId == 'cancelPost') {
                    await i.deferReply({ephemeral: true})
                    const byeEmbed = new ErrorEmbed('Goodbye', 'We are sad to see you go. :wave:')
                    return i.editReply({embeds: [byeEmbed]})
                }
            }).finally(()=>{return})
        }).finally(()=>{return})
    } catch {console.log}
}
export async function closePost(post:Post) {
    try {
        let channel: discord.Channel | null  | undefined = null
        if(post.type == jobTypes.vipJob.value) {
            // Text Channel
            channel = channels.vipJob;
            try {
                (channel as TextChannel).messages.fetch(post.stats.message.id).then((msg) => {
                    const embed = msg.embeds[0]
                    const applyBtn = new ButtonBuilder().setCustomId('button_post_apply').setLabel('Apply').setEmoji('📝').setStyle(ButtonStyle.Success).setDisabled(true)
                    if(post.type == jobTypes.commissionJob.value || post.type == jobTypes.paidJob.value || post.type == jobTypes.unpaidJob.value) applyBtn.setEmoji('💼')
                    const reportBtn = new ButtonBuilder().setCustomId('button_post_report').setLabel('Report').setEmoji('🚨').setStyle(ButtonStyle.Danger).setDisabled(true)
                    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(applyBtn, reportBtn)
                    const modifiedEmbed = modifyEmbed(embed)
                    msg.edit({embeds: [modifiedEmbed], components: [actionRow]})
                })
            } catch {console.log}
        } else {
            // Forum Channel
            switch (post.type) {
                case jobTypes.commissionJob.value:
                    channel = channels.commissionJob
                    break;
                case jobTypes.forHireAd.value:
                    channel = channels.forHireJob
                    break;
                case jobTypes.paidJob.value:
                    channel = channels.paidJob
                    break;
                case jobTypes.unpaidJob.value:
                    channel = channels.unpaidJob
                    break;
            }
            try {
                (channel as ForumChannel).threads.fetch(post.stats.message.id).then((thread) => {thread?.delete()})
            } catch {console.log}
        }
    } catch {console.log}
}
export async function automation(client: Client) {
    let posts = await getPosts()
    posts.forEach((post) => {
        if(Date.now() - post.stats.times.bumped >= bumpCooldown) {
            if(post.stats.premium) {
                let channel : discord.Channel | null | undefined = null
                switch (post.category) {
                    case jobTypes.commissionJob.value:
                        channel = channels.commissionJob
                        break;
                    case jobTypes.paidJob.value:
                        channel = channels.paidJob
                        break;
                    case jobTypes.unpaidJob.value:
                        channel = channels.unpaidJob
                        break;
                    case jobTypes.forHireAd.value:
                        channel = channels.forHireJob
                        break;
                }
                try {
                    (channel as ForumChannel).threads.fetch(post.stats.message.id).then((thread) => {
                        thread?.send(`Bump Message`).then((msg) => {msg.delete()})
                    })
                    updateBump(post.id)
                    const bumpLogPost = getLogEmbed(post.creatorId, post.category, post.creatorId, post.stats.message.url, true, 'Post Bumped! (Auto)');
                    (channels.bumpLogs as TextChannel).send({embeds: [bumpLogPost]})
                } catch {console.log}
            }
        }
    })
    posts.forEach(async(post) => {
        if(Date.now() - post.stats.times.creation >= cooldownTime) {
            if(post.stats.flags.checked) {
                if(Date.now() - post.stats.times.creation >= cooldownTime * 2) {
                    await closePost(post)
                    await deletePost(post.id)
                    const embed = new InfoEmbed(
                        `Post Deleted`,
                        `Hey! We noticed your post **${post.info.title}** has been open for more than 4 days. Thus due to our policy we have automatically removed it.`
                    )
    
                    const guild = client.guilds.cache.get(process.env.GUILDID || '')
                    try {
                        const member = await guild?.members.fetch(post.creatorId)
                        if(member) {
                            member.send({embeds: [embed]})
                        }
                    } catch {console.log}
                }
            } else {
                await updateFlag(post.id)
                const embed = new InfoEmbed(
                    `Still Looking?`,
                    `Hey! We noticed your post [${post.info.title}](${post.stats.message.url}) is still open. Are you still looking for someone?`
                ).setFooter({text: post.id})
                const yesBtn = new ButtonBuilder().setCustomId('button_ask_yes').setLabel(`Yes, I'm still Looking`).setStyle(ButtonStyle.Success)
                const noBtn = new ButtonBuilder().setCustomId('button_ask_no').setLabel(`No, I've found someone`).setStyle(ButtonStyle.Secondary)
                const actionRow = new ActionRowBuilder<ButtonBuilder>().setComponents(yesBtn, noBtn)

                const guild = client.guilds.cache.get(process.env.GUILDID || '')
                try {
                    const member = await guild?.members.fetch(post.creatorId)
                    if(member) {
                        member.send({embeds: [embed], components: [actionRow]})
                    }
                } catch {console.log}
            }
        }
    })
}