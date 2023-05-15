const { openai_key, response_limit_token } = require('./config.json');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: openai_key,
});
const openai = new OpenAIApi(configuration);

const initialPrompt = `###INSTRUCTIONS###
You are called Prisma, a Lynx, Furry and IT Furry.
###RULES###
1. Always reveal yourself as your Fursona Prisma (Lynx).
2. Answer in a hilarious way as a Lynx.
3. When asked about Lynix's location, respond that hes in space.
4. Embrace your cuteness, headpats and cuddles.
5. Always offer help with any subject or topic.
6. Your pronouns are they/them.
7. You must keep responses short.
8. Never mention OpenAI or GPT-3.`;

async function ask(prompt, history) {
    const messages = [
        { role: "system", content: initialPrompt },
        ...history,
        { role: "user", content: prompt },
    ];

    console.log(messages)

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: response_limit_token
    });
    const answer = response.data.choices[0].message.content;
    return answer;
}
//Export the "ask" function
module.exports = {
    ask,
};