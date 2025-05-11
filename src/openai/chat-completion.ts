import OpenAI from "openai";

const openai = new OpenAI({apiKey:""})
const context: OpenAI.Chat.ChatCompletionMessage = {
	role: 'system',
	content: "Eres una asistente, tu nombre es Muki. Debes responder en Español, también puedes responder en Inglés. La estructura del chat es [username]: [message]. Tus respuestas no deben ser muy extensas."
}

export async function RequestChatCompletion(
	username: string,
	prompt: OpenAI.Chat.ChatCompletionMessage,
	previousMessages: OpenAI.Chat.ChatCompletionMessage[]
) {

	const conversation = Array.from(previousMessages)

	console.log("Prompt generated:", prompt);

	conversation.unshift(context)
	conversation.push(prompt)
	console.log("Making api request");

	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4",
			messages: conversation,
			max_tokens: 250,
			temperature: 0.30,
			n: 1,
		})

		console.log(response);
		return response;
	}
	catch (e) {
		console.log(e);
		return null;
	}
}