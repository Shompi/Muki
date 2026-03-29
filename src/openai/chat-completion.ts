import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] })
const context: OpenAI.Chat.ChatCompletionMessage = {
  role: 'assistant',
  content: "Eres una asistente, tu nombre es Muki. Debes responder en Español, también puedes responder en Inglés. La estructura del chat es [username]: [message]. Tus respuestas no deben ser muy extensas.",
  refusal: "Lo siento, no puedo ayudarte con eso. Si tienes alguna otra pregunta o necesitas ayuda con algo más, estaré encantada de asistirte."
}

type ChatCompletionParams = {
  username: string,
  prompt: OpenAI.Chat.ChatCompletionMessage,
  previousMessages: OpenAI.Chat.ChatCompletionMessage[]
}

export async function RequestChatCompletion({ prompt, previousMessages }: ChatCompletionParams) {

  const conversation = Array.from(previousMessages)

  console.log("Prompt generated:", prompt);

  conversation.unshift(context)
  conversation.push(prompt)
  console.log("Making api request");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: conversation,
      max_completion_tokens: 1000,
      temperature: 0.35,
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