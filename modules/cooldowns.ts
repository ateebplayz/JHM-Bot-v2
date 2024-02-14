import { Collection, User } from "discord.js"
import { Command, CommandCooldown } from "./types"

export class CooldownHandler {
    /**
     * The cooldown collection. The key is the command name, the value is a collection of users and their cooldowns.
     * As cooldown collections for commands may be null at first, _initializeCommandCooldownCollection() should be called before accessing it.
     */     
    private cooldowns = new Collection<string, Collection<string, CommandCooldown>>();
    
    constructor() {
        this._tick = this._tick.bind(this)
        setInterval(this._tick, 500)
    }

    /**
     * Get the cooldown of a user
     * @param user The target user.
     * @param command The command to get the cooldown from.
     */
    public getCooldown(user:User, command:Command) {
        this._initializeCommandCooldownCollection(command)
        return this.cooldowns.get(command.data.name)?.get(user.id)
    }
    
    /**
     * Get whether a user is in cooldown
     * @param user The target user.
     * @param command The command to get the cooldown from.
     */
    public isCooldown(user:User, command:Command) {
        this._initializeCommandCooldownCollection(command)
        if(this.cooldowns.get(command.data.name)) {
            return (!!this.cooldowns.get(command.data.name)?.get(user.id))
        } else return false
    }

    /**
     * Set a cooldown for a user. command.options.cooldown will be used.
     * @param user The target user
     * @param command The command to set the cooldown on
     */
    public setCooldown(user: User, command: Command) {
        this._initializeCommandCooldownCollection(command);
        
        const commandCooldowns = this.cooldowns?.get(command.data.name);
        
        if (commandCooldowns) {
            commandCooldowns.set(user.id, { user, endsAt: new Date(Date.now() + (command.options?.cooldown || 0)) });
        } else {
            console.error(`Cooldowns collection for ${command.data.name} is undefined.`);
        }
    }
    
    /**
     * Initialize the cooldown collection for a command if it doesn't already exist.
     * This should be called regardless of whether it is initialized or not.
     * @see CooldownHander.cooldowns
     * @param command The commandname to initialize the cooldown for
     */
    private _initializeCommandCooldownCollection(command: Command) {
        if(this.cooldowns.get(command.data.name)) return
        this.cooldowns.set(command.data.name, new Collection<string, CommandCooldown>())
    }

    private _tick() {
        this.cooldowns.forEach(cmdCDColl => { //Command cooldown collection
            cmdCDColl.forEach((cooldown, command) => {
                if(cooldown.endsAt.getTime() < Date.now()) {
                    cmdCDColl.delete(cooldown.user.id)
                }
            })
        })
    }
}