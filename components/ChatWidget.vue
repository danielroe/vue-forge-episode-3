<script setup lang="ts">
import { nanoid } from "nanoid";
import { Message, User } from "~~/types";

const me = ref<User>({
  id: "user",
  avatar: "/avatar.jpg",
  name: "You",
});
const bot = ref<User>({
  id: "assistant",
  avatar: "/bot.jpg",
  name: "Botman",
});

const users = computed(() => [me.value, bot.value]);

const messages = useSessionStorage<Message[]>('messages', []);

const usersTyping = ref<User[]>([]);

// send messages to Chat API here
// and in the empty function below

async function handleNewMessage(message: Message) {
  messages.value.push(message);
  usersTyping.value.push(bot.value);
  try {
    const response = await $fetch('/api/ai', {
      method: 'POST',
      body: { message: message.text }
    })
    messages.value.push({
      id: nanoid(),
      createdAt: new Date(),
      text: response.content,
      userId: 'assistant',
    });
  } catch {
    messages.value.push({
      id: nanoid(),
      createdAt: new Date(),
      text: 'Sorry, I had a problem coming up with a response.',
      userId: 'assistant',
    });
  }
  usersTyping.value.splice(usersTyping.value.indexOf(bot.value), 1)
}
</script>

<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="messages"
    @new-message="handleNewMessage"
    :usersTyping="usersTyping"
  />
</template>
