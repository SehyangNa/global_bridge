export type MofaSafetyItem = {
  id: string
  countryName: string
  countryEnName: string
  title: string
  description: string
  lastUpdated: string
}

export type MofaSafetyResult = {
  ok: boolean
  live: boolean
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
        items: [],
        error: data.error ?? {
          code: 'PROXY_ERROR',
          message: 'The public data proxy returned an error.',
        },
      }
    }

    return {
      ok: true,
      live: Boolean(data.live && data.items?.length),
      items: data.items ?? [],
    }
  } catch {
    return {
      ok: false,
      live: false,
      items: [],
      error: {
        code: 'NETWORK_ERROR',
        message: 'The public data proxy could not be reached.',
      },
    }
  }
}
