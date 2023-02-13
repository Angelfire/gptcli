#!/usr/bin/env node

require('dotenv').config()

import { Command } from "commander"
import { Configuration, OpenAIApi } from "openai"

import packageJson from './package.json'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

console.log(`
..####...#####...######...........####...##......######.
.##......##..##....##............##..##..##........##...
.##.###..#####.....##....######..##......##........##...
.##..##..##........##............##..##..##........##...
..####...##........##.............####...######..######.
`)

const program = new Command()
  .version(packageJson.version)
  .description(packageJson.description)
  .option("-p, --prompt <value>", "What do you want to know/do?")
  .parse(process.argv);

const options = program.opts()

async function generate(prompt : string) {
  try {
    let loadingResponse: string = "loading answer..."

    console.log(loadingResponse)

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 256
    })

    if (response.status === 200) {
      loadingResponse = response.data.choices[0].text || loadingResponse

      console.log(loadingResponse)
    }

  } catch (e: any) {
    console.error(e.message)
    process.exit(1)
  }
}

if (options.prompt) {
  generate(options.prompt)
}

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
