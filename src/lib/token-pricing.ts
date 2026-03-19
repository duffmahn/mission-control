import { getProviderFromModel } from '@/lib/provider-subscriptions'

interface ModelPricing {
  inputPerMTok: number
  outputPerMTok: number
}

const DEFAULT_MODEL_PRICING: ModelPricing = {
  inputPerMTok: 3.0,
  outputPerMTok: 15.0,
}

const MODEL_PRICING: Record<string, ModelPricing> = {
  // === Anthropic ===
  'anthropic/claude-3-5-haiku-latest': { inputPerMTok: 0.8, outputPerMTok: 4.0 },
  'claude-3-5-haiku': { inputPerMTok: 0.8, outputPerMTok: 4.0 },
  'anthropic/claude-haiku-4-5': { inputPerMTok: 1.0, outputPerMTok: 5.0 },
  'claude-haiku-4-5': { inputPerMTok: 1.0, outputPerMTok: 5.0 },

  'anthropic/claude-sonnet-4-20250514': { inputPerMTok: 3.0, outputPerMTok: 15.0 },
  'claude-sonnet-4': { inputPerMTok: 3.0, outputPerMTok: 15.0 },
  'anthropic/claude-sonnet-4-5': { inputPerMTok: 3.0, outputPerMTok: 15.0 },
  'claude-sonnet-4-5': { inputPerMTok: 3.0, outputPerMTok: 15.0 },
  'anthropic/claude-sonnet-4-6': { inputPerMTok: 3.0, outputPerMTok: 15.0 },
  'claude-sonnet-4-6': { inputPerMTok: 3.0, outputPerMTok: 15.0 },

  'anthropic/claude-opus-4-5': { inputPerMTok: 15.0, outputPerMTok: 75.0 },
  'claude-opus-4-5': { inputPerMTok: 15.0, outputPerMTok: 75.0 },
  'anthropic/claude-opus-4-6': { inputPerMTok: 15.0, outputPerMTok: 75.0 },
  'claude-opus-4-6': { inputPerMTok: 15.0, outputPerMTok: 75.0 },

  // === DeepSeek (primary workhorse) ===
  'deepseek/deepseek-chat': { inputPerMTok: 0.28, outputPerMTok: 0.42 },
  'deepseek-chat': { inputPerMTok: 0.28, outputPerMTok: 0.42 },
  'deepseek/deepseek-reasoner': { inputPerMTok: 0.55, outputPerMTok: 2.19 },
  'deepseek-reasoner': { inputPerMTok: 0.55, outputPerMTok: 2.19 },

  // === Google Gemini ===
  'google/gemini-2.5-flash': { inputPerMTok: 0.30, outputPerMTok: 2.50 },
  'gemini-2.5-flash': { inputPerMTok: 0.30, outputPerMTok: 2.50 },
  'google/gemini-2.5-flash-lite': { inputPerMTok: 0.10, outputPerMTok: 0.40 },
  'gemini-2.5-flash-lite': { inputPerMTok: 0.10, outputPerMTok: 0.40 },

  // === Groq (speed-optimized) ===
  'groq/llama-3.1-8b-instant': { inputPerMTok: 0.05, outputPerMTok: 0.08 },
  'groq/meta-llama/llama-4-scout-17b-16e-instruct': { inputPerMTok: 0.11, outputPerMTok: 0.34 },
  'groq/qwen-qwq-32b': { inputPerMTok: 0.29, outputPerMTok: 0.59 },
  'groq/llama-3.3-70b-versatile': { inputPerMTok: 0.59, outputPerMTok: 0.79 },

  // === Mistral ===
  'mistral/devstral-small-latest': { inputPerMTok: 0.0, outputPerMTok: 0.0 },
  'devstral-small-latest': { inputPerMTok: 0.0, outputPerMTok: 0.0 },
  'mistral/mistral-large-latest': { inputPerMTok: 0.50, outputPerMTok: 1.50 },

  // === Moonshot/Kimi ===
  'moonshot/kimi-k2.5': { inputPerMTok: 0.45, outputPerMTok: 2.20 },
  'kimi-k2.5': { inputPerMTok: 0.45, outputPerMTok: 2.20 },
  'moonshot/kimi-latest': { inputPerMTok: 0.45, outputPerMTok: 2.20 },
  'kimi-for-coding': { inputPerMTok: 0.0, outputPerMTok: 0.0 },

  // === OpenAI ===
  'openai/gpt-4o-mini': { inputPerMTok: 0.15, outputPerMTok: 0.60 },
  'gpt-4o-mini': { inputPerMTok: 0.15, outputPerMTok: 0.60 },
  'openai/gpt-4o': { inputPerMTok: 2.50, outputPerMTok: 10.0 },
  'gpt-4o': { inputPerMTok: 2.50, outputPerMTok: 10.0 },

  // === Other providers ===
  'venice/llama-3.3-70b': { inputPerMTok: 0.7, outputPerMTok: 2.8 },
  'minimax/minimax-m2.1': { inputPerMTok: 0.3, outputPerMTok: 0.3 },
  'perplexity/sonar': { inputPerMTok: 1.0, outputPerMTok: 1.0 },
  'taalas/llama3.1-8B': { inputPerMTok: 0.0, outputPerMTok: 0.0 },

  // === Local (Ollama) — $0 ===
  'ollama/deepseek-r1:14b': { inputPerMTok: 0.0, outputPerMTok: 0.0 },
  'ollama/qwen2.5-coder:7b': { inputPerMTok: 0.0, outputPerMTok: 0.0 },
  'ollama/qwen2.5-coder:14b': { inputPerMTok: 0.0, outputPerMTok: 0.0 },
  'ollama/qwen3.5:35b-a3b': { inputPerMTok: 0.0, outputPerMTok: 0.0 },
  'ollama/phi4-mini': { inputPerMTok: 0.0, outputPerMTok: 0.0 },
}

function normalizedModelName(modelName: string): string {
  return modelName.trim().toLowerCase()
}

export function getModelPricing(modelName: string): ModelPricing {
  const normalized = normalizedModelName(modelName)
  if (MODEL_PRICING[normalized] !== undefined) return MODEL_PRICING[normalized]

  for (const [model, pricing] of Object.entries(MODEL_PRICING)) {
    const shortName = model.split('/').pop() || model
    if (normalized.includes(shortName)) return pricing
  }

  return DEFAULT_MODEL_PRICING
}

interface CostOptions {
  providerSubscriptions?: Record<string, boolean>
}

export function calculateTokenCost(
  modelName: string,
  inputTokens: number,
  outputTokens: number,
  options?: CostOptions,
): number {
  const provider = getProviderFromModel(modelName)
  if (provider !== 'unknown' && options?.providerSubscriptions?.[provider]) {
    return 0
  }

  const pricing = getModelPricing(modelName)
  return ((inputTokens * pricing.inputPerMTok) + (outputTokens * pricing.outputPerMTok)) / 1_000_000
}
