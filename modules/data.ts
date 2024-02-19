import { getLabelByValue, getNameByValue } from "./helpers"
import { Job, Post, jobType } from "./types"
export const JHMColorPremium = 0xd6af33
export const JHMColor = 0x2278ff
export const roleIds = {
    moderator: '1070817727813537933',
    developer: '1158367799266250832',
    vip: '1200957018282934323',
    premium: '1200957014206066901',
}
export const channelIds = {
    paidJob: '1208868490283585566',
    commissionJob: '1200827767244202114',
    forHireJob: '1200827093181792266',
    unpaidJob: '1200828645443375244',
    vipJob: '1199370979982442618',
    jobApproval: '1201956234677194812',
    jobApprovalLog: '1201955282910191656',
    reportLog: '1201955363201491024',
    dwcChannel: '1200820172945117214',
    scamChannel: '1069275876522471514',
    warnLogs: '1201955423499079700',
    sendLogs: '1201955458051735612',
    embedChannel: '1200834619478655046',
    bumpLogs: '1208788684644679740'
}
export const ownerId = '1021402677650935918'
export type JobTypeKeys = 'paidJob' | 'commissionJob' | 'forHireAd' | 'unpaidJob' | 'vipJob';
export const jobTypes: Record<JobTypeKeys, jobType> = {
    paidJob: {name: 'Paid Job', value: 1, label: 'Post a Paid Job'},
    commissionJob: {name: 'Commission Job', value: 2, label: 'Post a Commision Job'},
    forHireAd: {name: 'For-Hire Ad', value: 3, label: 'Post a For-Hire Ad'},
    unpaidJob: {name: 'Unpaid Job', value: 4, label: 'Post an Unpaid Job'},
    vipJob: {name: 'VIP Job', value: 5, label: 'Create Special Post'},
}
export const jobs: Array<Job> = [
    {label:"Writer", emoji:"✍", value:1, role: '1109578084451110913'},
    {label:"Designer", emoji:"🎨", value:2, role: '1200924199057903636'},
    {label:"Development", emoji:"👨‍💻", value:3, role: '1200924204468535426'},
    {label:"Marketer", emoji:"📊", value:4, role: '1200924212496449586'},
    {label:"Crypto-Web3", emoji:"🌐", value:5, role: '1200924211061989498'},
    {label:"Social Media", emoji:"📱", value:6, role: '1200924206762831992'},
    {label:"Videographer", emoji:"📸", value:7, role: '1200924209640132758'},
    {label:"Staff For-Hire", emoji:"👷‍♂️", value:8, role: '1200924215960948746'},
    {label:"UI/UX Designer", emoji:"💻", value:9, role: '1200924219337343117'},
    {label:"Affiliate Marketing", emoji:"👬", value:10, role: '1200924222923473007'},
    {label:"Video Editors", emoji:"🎥", value:11, role: '1200924202400743504'},
    {label:"Management", emoji:"🤵", value:12, role: '1200924200995668038'},
    {label:"Advertisers", emoji:"👨‍💼", value:13,role: '1200924220851503215'},
    {label:"Assistant", emoji:"💁‍♂️", value:14, role: '1200924195014594620'},
    {label:"Senior Developers", emoji:"👨‍💻", value:15, role: '1200924196981723277'},
    {label:"Part-Time Work", emoji:"🕐", value:16, role: '1200924208285372427'},
    {label:"Tutor", emoji:"👨‍🏫", value:17, role: '1200924214014783558'},
    {label:"Digital Marketing", emoji:"💰", value:18, role: '1200924217735139358'},
    {label:"Others", emoji:"❔", value:19, role: '1200924193265565717'},
]
export const INVISIBLE_CHARACTER = "ㅤ"
export const DONE_EMOJI = "<:done:1132644555834011748>"
export const WARN_EMOJI = "<:warn:1132713539790962828>"
export const REPORT_EMOJI = "<:report:1132700491424485426>"
export const ID_EMOJI = "<:ID_128px:1163154266031128736>"
export const ID_TEST = "<:imageedit_10_2485698715:1163154266031128736>"
export const INFO_EMOJI = "<:Info_128px:1142816852330950767>"
export const CARD_EMOJI = "<:Card_128px:1141760339168473108>"
export const CLOCK_EMOJI = "<:Clock_128px:1141758447252156567>"
export const PERSON_EMOJI = "<:Person_128px:1141761483592708168>"
export const DESCRIPTION_EMOJI = "<:Description_128px:1141757183218954341>"
export const TOP_TO_RIGHT_EMOJI = "<:Top_To_Right_128px:1142919222205353994>"
export const ID_PREMIUM_EMOJI = "<:ID_Premium_128px:1142911416895013037>"
export const CARD_PREMIUM_EMOJI = "<:Card_Premium_128px:1141779093772308520>"
export const CLOCK_PREMIUM_EMOJI = "<:Clock_Premium_128px:1141779097392005180>"
export const PERSON_PREMIUM_EMOJI = "<:Person_Premium_128px:1141779103213695006>"
export const DESCRIPTION_PREMIUM_EMOJI = "<:Description_Premium_128px:1141779099413663784>"
export const TOP_TO_RIGHT_PREMIUM_EMOJI = "<:Top_To_Right_Premium_128px:1142918353552408701>"
export const JHM_LOGO_URL = "https://i.imgur.com/0dLb0GL.png"
export const FOR_HIRE_BANNER_URL = "https://i.imgur.com/VswWxUV.png"
export const PAID_JOB_BANNER_URL = "https://i.imgur.com/gWU5mS1.png"
export const UNPAID_JOB_BANNER_URL = "https://i.imgur.com/Eym6lYi.png"
export const COMMISSION_JOB_BANNER_URL = "https://i.imgur.com/oN7TrfI.png"
export const PREMIUM_PAID_JOB_BANNER_URL = "https://i.imgur.com/TkYejlU.png"
export const PREMIUM_FOR_HIRE_BANNER_URL = "https://i.imgur.com/TuR1WE3.png"
export const PREMIUM_UNPAID_JOB_BANNER_URL = "https://i.imgur.com/2qC9vyq.png"
export const PREMIUM_VIP_HIRING_BANNER_URL = "https://i.ibb.co/Z2ZFYwS/JHM-Premium-VIP-Hiring-Banner.png"
export const PREMIUM_COMMISSION_JOB_BANNER_URL = "https://i.imgur.com/nnjtLfi.png"
export const logExtraData = (post: Post) => { return {name:'Information', value: `**User ID** : ${post.creatorId}\n**User Tag** : <@!${post.creatorId}>\n**Category** : ${getLabelByValue(post.category)}\n**Job Type** : ${getNameByValue(post.type)}`}}
export const bumpCooldown = 172800000
export const cooldownTime = 172800000