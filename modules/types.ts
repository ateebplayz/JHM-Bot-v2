import discord from 'discord.js'
import { CooldownHandler } from './cooldowns'

export interface CommandOptions {
    /**
     * All users/
     * existing members(players)/
     * develoeprs are allowed to run
     */
    permissionLevel?: 'all' | 'member' | 'dev' | 'admin' | 'mod'
    cooldown?: number
    aliases?: Array<string>
}

export interface Command {
    data: discord.RESTPostAPIApplicationCommandsJSONBody
    options?: CommandOptions
    execute: (interaction: discord.Interaction) => Promise<void>
}

export interface CommandCooldown {
    user: discord.User,
    endsAt: Date
}

export interface InteractionHandler {
    data: InteractionHandlerData
    execute: (interaction: discord.Interaction) => Promise<void>
}

interface InteractionHandlerData {
    customId: string,
    type: "autocomplete" | "component"
}
export interface JHMClient extends discord.Client  {
    commands: discord.Collection<string, Command>,
    interactions: discord.Collection<string, InteractionHandler>,
    cooldowns: CooldownHandler,
}

export interface jhmUser {
    userId: string,
    posts: Array<string>
}

export interface Post {
    id: string,
    category: number,
    creatorId: string,
    type: number,
    info: {
        title: string,
        desc: string,
        budget: string,
        deadline: string,
        location: string,
        portfolio: string
    },
    stats: {
        approved: boolean,
        times: {
            creation: number,
            bumped: number,
        },
        flags: {
            checked: boolean,
        },
        message: {
            id: string,
            url: string,
        },
        premium: boolean
    }
}

export interface jobType {
    name: string, value: number, label: string
}

export interface Job {
    label: string,
    emoji: string,
    value: number,
    role: string
}