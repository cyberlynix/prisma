# Prisma
Prisma is a discord bot using the GPT-3.5 model from OpenAI to generate messages based on the context of the conversation. 

## Installation
1. Clone the repository
2. Install the requirements using `npm i`
3. Setup your config.json file
4. Run the bot using `node bot.js`

## Example Config
```
{
    "discord_token": "",
    "openai_key": "",
    "owner_id": 0,
    "response_limit_token": 100,
    "request_limit": 1000,
    "rate_limit": 20,
    "rate_limit_priority": 5,
    "allow_dms": true,
    "allow_mentions": true,
    "prisma_gpt_disabled": false,
    "trusted_guilds": [
    ],
    "banned_members": [
    ]
}
```