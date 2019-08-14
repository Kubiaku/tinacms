import path from 'path'
import os from 'os'
import * as fs from 'fs'

const configPath = path.join(os.homedir(), '.forestry-config')

export const readConfig = () => {
  try {
    let rawConfig = fs.readFileSync(configPath)
    return JSON.parse(rawConfig)
  } catch (e) {
    return {}
  }
}

export const writeConfig = newConfig => {
  fs.writeFileSync(configPath, JSON.stringify({ ...readConfig(), newConfig }))
}

export const isAuthenticated = () => {
  const config = readConfig()
  return !!config.token
}
