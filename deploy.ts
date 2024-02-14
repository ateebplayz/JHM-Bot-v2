import chalk from 'chalk';
import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as dotenv from 'dotenv';
dotenv.config()

const rootDir = process.env.NODE_ENV === 'production' ? '' : 'dist/'

const commands = [];
const commandFiles = fs.readdirSync(rootDir + 'commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}
const rest = new REST({ version: '9' }).setToken(process.env.BOTTOKEN || '');

//TODO: Read from config

rest.put(Routes.applicationGuildCommands(process.env.CLIENTID || '', process.env.GUILDID || ''), { body: commands })
    .then(() => console.log(chalk.bold('Successfully registered application commands.')))
    .catch(console.error);