import { Collection, Message, Snowflake } from "discord.js"
import { RequestChatCompletion } from "../../openai/chat-completion.js";
import { type ChatCompletionMessage } from "openai/resources/chat/index.js";

const userMessageHistory = new Collection<Snowflake, ChatCompletionMessage[]>()
const pendingSweeps = new Set<Snowflake>()


// Chat completion
export async function ChatCompletion(message: Message) {

	const userMessages = userMessageHistory.get(message.author.id) ?? []

	const newPrompt: ChatCompletionMessage = {
		role: 'user',
		content: `${message.author.username}: ${message.cleanContent}`
	}

	const response = await RequestChatCompletion(
		message.author.username,
		newPrompt,
		userMessages
	)

	if (response.choices[0].message?.content === null
		|| response.choices[0].message?.content === undefined) return null

	await message.reply({
		content: response.choices[0].message.content
	})

	pendingSweeps.has(message.author.id) ? true : () => {
		setTimeout((msg) => {
			userMessageHistory.delete(msg.author.id)
			pendingSweeps.delete(message.author.id)
			console.log(`Message history of ${message.author.username} has been deleted.`);
		}, 60000 * 5, message);
	}
}