const storage = useStorage()

interface Message {
  role: 'user' | 'system' | 'assistant'
  content: string
}

export default defineEventHandler(async event => {
  const { message } = await readBody(event)
  const session = await useSession(event, { password: useRuntimeConfig().sessionToken })

  const key = session.id + ':messages'
  const messages = await storage.getItem(key) as Message[] || []

  messages.push({ role: 'user', content: message })

  const { data } = await $openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful customer support chat assistant for an exciting AI-powered social media post generator.' },
      ...messages,
    ]
  })

  const response = data.choices[0].message

  messages.push({ role: 'assistant', content: response?.content || '' })
  await storage.setItem(key, messages)

  return response
})
