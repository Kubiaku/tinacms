import 'isomorphic-fetch'

//@ts-ignore
import { version, name } from '../package.json'

import { Cli, Builtins, Command } from 'clipanion'
import chalk from 'chalk'
import dotenv from 'dotenv'
import fs from 'fs'
import prompts from 'prompts'

import { RedisUserStore } from './redis-user-store'
import { UserStore } from './types'

const CHOICES = {
  ADD: { title: 'Add a user', value: 'ADD' },
  UPDATE: { title: "Update a user's password", value: 'UPDATE' },
  DELETE: { title: 'Delete a user', value: 'DELETE' },
  EXIT: { title: 'Exit', value: 'EXIT' },
}

const promptUserForToken = async () => {
  console.log('Did not find KV store url and token in .env file.')
  // Prompt user for KV store url and token
  const answers = await prompts([
    {
      type: 'text',
      name: 'url',
      message: `Enter your Vercel KV Database URL (see https://vercel.com/dashboard/stores):`,
    },
    {
      type: 'text',
      name: 'token',
      message: `Enter your Vercel KV Database token:`,
    },
    {
      type: 'text',
      name: 'credentials_key',
      message: `Enter your Credentials key (default: 'tinacms_users'):`,
      initial: 'tinacms_users',
    },
  ])

  if (!process.env.KV_REST_API_URL) {
    fs.writeFileSync('.env', `KV_REST_API_URL=${answers.url}\n`, { flag: 'a' })
    process.env.KV_REST_API_URL = answers.url
  }
  if (!process.env.KV_REST_API_TOKEN) {
    fs.writeFileSync('.env', `KV_REST_API_TOKEN=${answers.token}\n`, {
      flag: 'a',
    })
    process.env.KV_REST_API_TOKEN = answers.token
  }
  if (!process.env.NEXTAUTH_CREDENTIALS_KEY) {
    fs.writeFileSync(
      '.env',
      `NEXTAUTH_CREDENTIALS_KEY=${answers.credentials_key}\n`,
      { flag: 'a' }
    )
    process.env.NEXTAUTH_CREDENTIALS_KEY = answers.credentials_key
  }
}

const addUser = async (
  name: string,
  password: string,
  passwordConfirm: string,
  userStore: UserStore
) => {
  if (password !== passwordConfirm) {
    console.log(chalk.red('Passwords do not match!'))
    process.exit(1)
  }
  if (await userStore.addUser(name, password)) {
    console.log(chalk.green(`User ${name} added!`))
  } else {
    console.log(chalk.red(`Error adding user ${name}!`))
  }
}

export const updatePassword = async (
  name: string,
  password: string,
  passwordConfirm: string,
  userStore: UserStore
) => {
  if (password !== passwordConfirm) {
    console.log(chalk.red('Passwords do not match!'))
    process.exit(1)
  }
  if (await userStore.updatePassword(name, password)) {
    console.log(chalk.green(`User ${name} password updated!`))
  } else {
    console.log(chalk.red(`Error updating user ${name} password!`))
  }
}

export const deleteUser = async (name: string, userStore: UserStore) => {
  if (await userStore.deleteUser(name)) {
    console.log(chalk.green(`User ${name} deleted!`))
  } else {
    console.log(chalk.red(`Error deleting user ${name}!`))
  }
}

class SetupCommand extends Command {
  static paths = [['setup']]
  static usage = Command.Usage({
    category: `Commands`,
    description: `Configure TinaCMS Users`,
    examples: [[`A basic example`, `$0 setup`]],
  })

  async execute(): Promise<number | void> {
    await fs.promises.stat('.env').catch(async (_) => {
      await fs.promises
        .stat('.env.example')
        .then(async (_) => {
          fs.copyFileSync('.env.example', '.env')
        })
        .catch(async (_) => {
          console.log(chalk.red('No .env file found!'))
          process.exit(1)
        })
    })
    dotenv.config()

    console.log(chalk.green('Welcome to TinaCMS!'))

    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      await promptUserForToken()
    }

    let done = false
    const userStore = new RedisUserStore(process.env.NEXTAUTH_CREDENTIALS_KEY, {
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })

    // Loop until user exits
    while (!done) {
      const users = await userStore.getUsers()
      if (!users?.length) {
        console.log(chalk.red('No users found! Please add a user.'))
      } else {
        console.log(chalk.green('Users:'))
        console.table(
          users.map((user) => {
            return {
              name: user.name,
            }
          })
        )
      }

      const answers = await prompts([
        {
          type: 'select',
          name: 'choice',
          message: `What would you like to do?`,
          choices: [CHOICES.ADD, CHOICES.UPDATE, CHOICES.DELETE, CHOICES.EXIT],
        },
        {
          type: (_, answers) =>
            answers.choice === 'ADD' ||
            answers.choice === 'UPDATE' ||
            answers.choice === 'DELETE'
              ? 'text'
              : null,
          name: 'name',
          message: `Enter a username:`,
        },
        {
          type: (_, answers) =>
            answers.choice === 'ADD' || answers.choice === 'UPDATE'
              ? 'password'
              : null,
          name: 'password',
          message: `Enter a user password:`,
        },
        {
          type: (_, answers) =>
            answers.choice === 'ADD' || answers.choice === 'UPDATE'
              ? 'password'
              : null,
          name: 'passwordConfirm',
          message: `Confirm the user password:`,
        },
      ])

      if (answers.choice === 'ADD') {
        const { name, password, passwordConfirm } = answers
        try {
          await addUser(name, password, passwordConfirm, userStore)
        } catch (e) {
          console.log(
            chalk.red(
              `An unexpected error occurred while adding a user. ${e.message}}`
            )
          )
        }
      } else if (answers.choice === 'UPDATE') {
        const { name, password, passwordConfirm } = answers
        try {
          await updatePassword(name, password, passwordConfirm, userStore)
        } catch (e) {
          console.log(
            chalk.red(
              `An unexpected error occurred while adding a updating the password for ${name}. ${e.message}}`
            )
          )
        }
      } else if (answers.choice === 'DELETE') {
        const { name } = answers
        try {
          await deleteUser(name, userStore)
        } catch (e) {
          console.log(
            chalk.red(
              `An unexpected error occurred while deleting the user ${name}. ${e.message}}`
            )
          )
        }
      } else if (answers.choice === 'EXIT') {
        done = true
      }
    }
  }
}

const cli = new Cli({
  binaryName: `tinacms-next-auth`,
  binaryLabel: `TinaCMS NextAuth`,
  binaryVersion: version,
})

cli.register(SetupCommand)
cli.register(Builtins.DefinitionsCommand)
cli.register(Builtins.HelpCommand)
cli.register(Builtins.VersionCommand)

export default cli
