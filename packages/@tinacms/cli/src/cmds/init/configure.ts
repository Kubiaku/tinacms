import { Framework, GeneratedFile, InitEnvironment } from '.'
import prompts, { PromptType } from 'prompts'
import { linkText, logText } from '../../utils/theme'

async function configure(
  env: InitEnvironment,
  opts: { showSelfHosted?: boolean }
) {
  const promptOptions = { onCancel: () => process.exit(0) } // allow ctrl + c to exit

  // helpers
  const isNext = (promptType: PromptType) => (_, answers) =>
    answers.framework.name === 'next' ? promptType : null
  const isNextAuth = (promptType: PromptType) => (_, answers) =>
    answers.nextAuth ? promptType : null
  const dataLayerEnabled = (promptType: PromptType) => (_, answers) =>
    answers.dataLayer ? promptType : null
  const kvRestApiUrlEnabled = (promptType: PromptType) => (_, answers) =>
    answers.kvRestApiUrl ? promptType : null
  const selfHostedEnabled = (promptType: PromptType) => (_) =>
    opts.showSelfHosted ? promptType : null

  // conditionally generate overwrite prompts for generated ts/js
  const generatedFileOverwritePrompt = ({
    condition,
    configName,
    generatedFile,
  }: {
    configName: string
    condition: (answers: any) => boolean
    generatedFile: GeneratedFile
  }) => {
    const results = []
    if (generatedFile.javascriptExists) {
      results.push({
        name: `overwrite${configName}JS`,
        type: (_, answers) =>
          !answers.typescript && condition(answers) ? 'confirm' : null,
        message: `Found existing file at ${env.generatedFiles['auth'].fullPathJS}. Would you like to override?`,
      })
    }
    if (generatedFile.typescriptExists) {
      results.push({
        name: `overwrite${configName}TS`,
        type: (_, answers) =>
          answers.typescript && condition(answers) ? 'confirm' : null,
        message: `Found existing file at ${env.generatedFiles['auth'].fullPathTS}. Would you like to override?`,
      })
    }
    return results
  }

  const forestryDisclaimer = logText(
    `Note: This migration will update some of your content to match tina.  Please save a backup of your content before doing this migration. (This can be done with git)`
  )

  let config: Record<any, any> = await prompts(
    [
      {
        name: 'packageManager',
        type: 'select',
        message: 'Choose your package manager',
        choices: [
          { title: 'PNPM', value: 'pnpm' },
          { title: 'Yarn', value: 'yarn' },
          { title: 'NPM', value: 'npm' },
        ],
      },
      {
        name: 'framework',
        type: 'select',
        message: 'What framework are you using?',
        choices: [
          { title: 'Next.js', value: { name: 'next', reactive: true } },
          { title: 'Hugo', value: { name: 'hugo', reactive: false } },
          { title: 'Jekyll', value: { name: 'jekyll', reactive: false } },
          {
            title: 'Other (SSG frameworks like gatsby, etc.)',
            value: { name: 'other', reactive: false },
          },
        ] as { title: string; value: Framework }[],
      },
      {
        name: 'typescript',
        type: 'confirm',
        initial: true,
        message:
          'Would you like to use Typescript for your Tina Configuration (Recommended)?',
      },
      {
        name: 'publicFolder',
        type: (_, answers) =>
          answers.framework.name !== 'next' && answers.framework.name !== 'hugo'
            ? 'text'
            : null,
        initial: 'public',
        message:
          `Where are public assets stored? (default: "public")\n` +
          logText(
            `Not sure what value to use? Refer to our "Frameworks" doc: ${linkText(
              'https://tina.io/docs/integration/frameworks/#configuring-tina-with-each-framework'
            )}`
          ),
      },
      {
        name: 'forestryMigrate',
        type: (_) => (env.forestryConfigExists ? 'confirm' : null),
        initial: true,
        message: `Would you like to migrate your Forestry templates?\n${forestryDisclaimer}`,
      },
      {
        name: 'frontMatterFormat',
        type: (_, answers) => {
          if (answers.framework.name === 'hugo' && answers.forestryMigrate) {
            if (env.frontMatterFormat && env.frontMatterFormat[1]) {
              return null
            }
            return 'select'
          }
        },
        choices: [
          { title: 'yaml', value: 'yaml' },
          { title: 'toml', value: 'toml' },
          { title: 'json', value: 'json' },
        ],
        message: `What format are you using in your frontmatter?`,
      },
      {
        name: 'overwriteTemplatesJS',
        type: (_, answers) =>
          !answers.typescript
            ? env.generatedFiles['templates'].javascriptExists
              ? 'confirm'
              : null
            : null,
        message: `Found existing file at ${env.generatedFiles['templates'].javascriptExists}. Would you like to override?`,
      },
      {
        name: 'overwriteTemplatesTS',
        type: (_, answers) =>
          answers.typescript
            ? env.generatedFiles['templates'].typescriptExists
              ? 'confirm'
              : null
            : null,
        message: `Found existing file at ${env.generatedFiles['templates'].fullPathTS}. Would you like to override?`,
      },
      {
        name: 'dataLayer',
        type: selfHostedEnabled('confirm'),
        initial: true,
        message: 'Enable Self-Hosted Data Layer?',
      },
      {
        name: 'clientId',
        type: (_, answers) => (answers.dataLayer ? 'text' : null),
        message: `What is your Tina Cloud Client ID? (Hit enter to skip and set up yourself later)\n${logText(
          "Don't have a Client ID? Create one here: "
        )}${linkText('https://app.tina.io/projects/new')}`,
      },
      {
        name: 'token',
        type: (_, answers) => (answers.dataLayer ? 'text' : null),
        message: (prev) =>
          `What is your Tina Cloud Read Only Token?\n${logText(
            "Don't have a Read Only Token? Create one here: "
          )}${linkText(
            `https://app.tina.io/projects/${prev || '[XXX]'}/tokens`
          )}`,
      },
      {
        name: 'dataLayerAdapter',
        message: 'Select a self-hosted data layer adapter',
        type: dataLayerEnabled('select'),
        choices: (_, answers) => {
          if (answers.framework.name === 'next') {
            return [
              { title: 'Vercel KV', value: 'upstash-redis' },
              { title: 'Upstash Redis', value: 'upstash-redis' },
            ]
          } else {
            return [{ title: 'Upstash Redis', value: 'upstash-redis' }]
          }
        },
      },
      {
        name: 'nextAuth',
        type:
          selfHostedEnabled('confirm') && isNext('confirm') ? 'confirm' : null,
        initial: 'true',
        message: 'Enable NextAuth.js integration?',
      },
      {
        name: 'nextAuthProvider',
        message: 'Select a self-hosted data layer adapter',
        type: isNextAuth('select'),
        choices: [
          {
            title: 'Vercel KV Credentials Provider',
            value: 'vercel-kv-credentials-provider',
          },
        ],
      },
      {
        name: 'nextAuthCredentialsProviderName',
        type: (_, answers) =>
          answers.nextAuthProvider === 'vercel-kv-credentials-provider'
            ? 'text'
            : null,
        message: `Enter a name for the Vercel KV Credentials Provider (Defaults to "VercelKVCredentialsProvider")`,
        initial: 'VercelKVCredentialsProvider',
      },
      // tina/auth.ts
      ...generatedFileOverwritePrompt({
        condition: (answers) => !!answers.nextAuthProvider,
        configName: 'Auth',
        generatedFile: env.generatedFiles['auth'],
      }),
      // pages/api/auth/[...nextauth].ts
      ...generatedFileOverwritePrompt({
        condition: (answers) => !!answers.nextAuthProvider,
        configName: 'NextAuthApiHandler',
        generatedFile: env.generatedFiles['next-auth-api-handler'],
      }),
      // pages/auth/signin.tsx
      ...generatedFileOverwritePrompt({
        condition: (answers) =>
          answers.nextAuthProvider === 'vercel-kv-credentials-provider',
        configName: 'VercelKVCredentialsProviderSignin',
        generatedFile:
          env.generatedFiles['vercel-kv-credentials-provider-signin'],
      }),
      // pages/auth/register.tsx
      ...generatedFileOverwritePrompt({
        condition: (answers) =>
          answers.nextAuthProvider === 'vercel-kv-credentials-provider',
        configName: 'VercelKVCredentialsProviderRegister',
        generatedFile:
          env.generatedFiles['vercel-kv-credentials-provider-register'],
      }),
      {
        name: 'isLocalEnvVarName',
        type: (_, answers) =>
          answers.nextAuth || answers.dataLayer ? 'text' : null,
        message: `Enter a name for the environment variable that will be used to determine if the app is running locally (Defaults to "TINA_PUBLIC_IS_LOCAL")`,
        initial: 'TINA_PUBLIC_IS_LOCAL',
      },
      // tina/config.ts
      ...generatedFileOverwritePrompt({
        condition: (answers) => true,
        configName: 'Config',
        generatedFile: env.generatedFiles['config'],
      }),
      {
        name: 'overwriteSampleContent',
        type: (_) => (env.sampleContentExists ? 'confirm' : null),
        message: `Found existing file at ${env.sampleContentPath}. Would you like to override?`,
      },
    ],
    promptOptions
  )

  if (config.dataLayerAdapter === 'upstash-redis') {
    config = {
      ...config,
      ...(await prompts([
        {
          name: 'kvRestApiUrl',
          type: 'text',
          message: `What is the KV (Redis) Rest API URL? (Hit enter to skip and set up yourself later)`,
        },
        {
          name: 'kvRestApiToken',
          type: kvRestApiUrlEnabled('text'),
          message: `What is the KV (Redis) Rest API Token? (Hit enter to skip and set up yourself later)`,
        },
      ])),
    }
  }

  if (config.nextAuth) {
    config = {
      ...config,
      ...(await prompts([
        {
          name: 'nextAuthSecret',
          type: 'text',
          message: `What is the NextAuth.js Secret? (Hit enter to use a randomly generated secret)`,
        },
      ])),
    }
  }

  if (config.nextAuthProvider === 'vercel-kv-credentials-provider') {
    config = {
      ...config,
      ...(await prompts([
        {
          name: 'kvRestApiUrl',
          type: kvRestApiUrlEnabled('text'),
          message: `What is the Vercel KV Rest API URL? (Hit enter to skip and set up yourself later)\n${logText(
            "Don't have a Vercel KV Store? Create one here: "
          )}${linkText('https://vercel.com/dashboard/stores')}`,
        },
        {
          name: 'kvRestApiToken',
          type: kvRestApiUrlEnabled('text'),
          message: `What is the Vercel KV Rest API Token? (Hit enter to skip and set up yourself later)`,
        },
        {
          name: 'vercelKVNextAuthCredentialsKey',
          type: 'text',
          message: `Enter a name for the Vercel KV Credentials Provider Auth Collection`,
        },
      ])),
    }
  }

  if (config.framework.name === 'next') {
    config.publicFolder = 'public'
  } else if (config.framework.name === 'hugo') {
    config.publicFolder = 'static'
  }

  return config
}

export default configure
