import { Configuration, OpenAIApi } from 'openai'

const config = useRuntimeConfig()

const openaiConfig = new Configuration({
  apiKey: config.openai.apiKey,
})

export const $openai = new OpenAIApi(openaiConfig)

// Alternative approach without `openai` dependency
// 
// export const $openai = $fetch.create({
//   method: 'POST',
//   baseURL: 'https://api.openai.com/v1/',
//   headers: {
//     Authorization: `Bearer ${config.openai.apiKey}`,
//   },
// })
