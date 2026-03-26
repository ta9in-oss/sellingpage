import { createServerFn } from '@tanstack/react-start'

interface DeployStoreInput {
  storeId: string
  slug: string
  cfAccountId: string
  cfApiToken: string
  instantAppId: string
  instantAdminToken: string
  chargilyApiKey?: string
}

interface DeployStoreResult {
  success: boolean
  deployedUrl: string
  projectName: string
  message: string
}

const CF_API = 'https://api.cloudflare.com/client/v4'

async function cfRequest(
  method: string,
  path: string,
  token: string,
  body?: unknown
): Promise<unknown> {
  const res = await fetch(`${CF_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = (await res.json()) as { success: boolean; errors: { message: string }[]; result: unknown }
  if (!data.success) {
    const msg = data.errors?.[0]?.message ?? 'Cloudflare API error'
    throw new Error(`CF API: ${msg}`)
  }
  return data.result
}

export const deployStore = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as DeployStoreInput)
  .handler(async ({ data }): Promise<DeployStoreResult> => {
    const {
      slug,
      cfAccountId,
      cfApiToken,
      instantAppId,
      instantAdminToken,
      chargilyApiKey,
    } = data

    const projectName = `7aba-${slug}`
    const deployedUrl = `https://${projectName}.pages.dev`

    // 1. Verify CF credentials
    await cfRequest('GET', `/accounts/${cfAccountId}`, cfApiToken)

    // 2. Check if project already exists
    let projectExists = false
    try {
      await cfRequest('GET', `/accounts/${cfAccountId}/pages/projects/${projectName}`, cfApiToken)
      projectExists = true
    } catch {
      projectExists = false
    }

    // 3. Create CF Pages project if it doesn't exist
    if (!projectExists) {
      await cfRequest('POST', `/accounts/${cfAccountId}/pages/projects`, cfApiToken, {
        name: projectName,
        production_branch: 'main',
        build_config: {
          build_command: 'pnpm install && pnpm build',
          destination_dir: 'dist',
          root_dir: 'apps/store',
        },
        source: {
          type: 'github',
          config: {
            owner: 'Ta9in',
            repo_name: 'sellingpage',
            production_branch: 'main',
            pr_comments_enabled: false,
            deployments_enabled: true,
          },
        },
      })
    }

    // 4. Set environment variables on the project
    const envVars: Record<string, { value: string; type: 'secret_text' | 'plain_text' }> = {
      VITE_INSTANT_APP_ID: { value: instantAppId, type: 'plain_text' },
      INSTANT_ADMIN_TOKEN: { value: instantAdminToken, type: 'secret_text' },
      VITE_APP_URL: { value: `https://${projectName}.pages.dev`, type: 'plain_text' },
    }
    if (chargilyApiKey) {
      envVars.CHARGILY_SECRET_KEY = { value: chargilyApiKey, type: 'secret_text' }
    }

    await cfRequest('PATCH', `/accounts/${cfAccountId}/pages/projects/${projectName}`, cfApiToken, {
      deployment_configs: {
        production: { env_vars: envVars },
        preview: { env_vars: envVars },
      },
    })

    return {
      success: true,
      deployedUrl,
      projectName,
      message: `تم إعداد المشروع على Cloudflare Pages: ${deployedUrl}`,
    }
  })
