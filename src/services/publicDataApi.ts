export type MofaSafetyItem = {
  id: string
  title: string
  summary: string
  lastUpdated: string
}

export type MofaDataStatus = 'live' | 'archived' | 'fallback'

export type MofaSafetyResult = {
  ok: boolean
  live: boolean
  status: MofaDataStatus
  items: MofaSafetyItem[]
  error?: {
    code: string
    message: string
  }
}

export async function fetchMofaSafetyInfo(
  country: string,
): Promise<MofaSafetyResult> {
  try {
    const response = await fetch(
      `/api/mofa-safety?country=${encodeURIComponent(country)}`,
      { headers: { Accept: 'application/json' } },
    )
    const data = (await response.json()) as Partial<MofaSafetyResult>

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        live: false,
        status: 'fallback',
        items: [],
        error: data.error ?? {
          code: 'PROXY_ERROR',
          message: 'The public data proxy returned an error.',
        },
      }
    }

    return {
      ok: true,
      live: data.status === 'live' && Boolean(data.items?.length),
      status:
        data.status === 'live' || data.status === 'archived'
          ? data.status
          : 'fallback',
      items: data.items ?? [],
    }
  } catch {
    return {
      ok: false,
      live: false,
      status: 'fallback',
      items: [],
      error: {
        code: 'NETWORK_ERROR',
        message: 'The public data proxy could not be reached.',
      },
    }
  }
}
