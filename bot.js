const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
const { discord_token, trusted_guilds, banned_members, request_limit, prisma_gpt_disabled } = require('./config.json');
const { ask } = require("./ai.js");

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent],
	'partials': [Partials.Channel]
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async (message) => {
	// Ignore messages from bots
	if (message.author.bot) return;

	if (!message.guild) {
		if (message.content.length > request_limit) {
			message.channel.send("> **ERROR:** Mrow! Your message is too long!")
			return;
		}

		if(prisma_gpt_disabled) {
			message.channel.send("> **ERROR:** Mrow! I'm currently disabled as my server is offline!")
			return;
		}

		if (banned_members.includes(message.author.id)) {
			message.channel.send("> **ERROR:** Mrow! You're not allowed to speak with me!")
			return;
		}

		const messages = await message.channel.messages.fetch({ limit: 2 });
		const history = messages.map((msg) => ({
			role: msg.author.bot ? 'assistant' : 'user',
			content:  msg.author.bot ? `${msg.content}` : `[${msg.createdAt}] ${msg.author.username}: ${msg.content}`,
		}));

		console.log("-- DM Response --");
		//message.channel.send(`> **ERROR:** I'm not quite ready to respond to you just yet! Mrow!`);
		// Set typing status
		message.channel.sendTyping();
		
		try {
			let prompt = message.content.replace(/<@!?\d+>/g, '').trim();
			// Add username User: to prompt
			prompt = `[${message.createdAt}] ${message.author.username}: ${prompt}`;
			const answer = await ask(prompt, history); //prompt GPT-3
			//Edit the message to include the response
			message.channel.send(answer)
		} catch {
			message.channel.send("> **ERROR:** Oops something went wrong! Mrow!")
		}
	}

	if (message.guild) {
		// Fetch history of messages
		const messages = await message.channel.messages.fetch({ limit: 2 });
		const history = messages.map((msg) => ({
			role: msg.author.bot ? 'assistant' : 'user',
			content:  msg.author.bot ? `${msg.content}` : `[${msg.createdAt}] ${msg.author.username}: ${msg.content}`,
		}));
		  
		if (message.mentions.has(client.user)) {
			if(prisma_gpt_disabled) {
				message.channel.send("> **ERROR:** Mrow! I'm currently disabled as my server is offline!")
				return;
			}

			if (message.content.length > request_limit) {
				message.channel.send("> **ERROR:** Mrow! Your message is too long!")
				return;
			}

			if (!trusted_guilds.includes(message.guild.id)) {
				message.channel.send("> **ERROR:** Mrow! I'm not allowed to talk here!")
				console.log(`Guild ${message.guild.id} is not in the trusted guilds array!`);
				return;
			}

			if (banned_members.includes(message.author.id)) {
				message.channel.send("> **ERROR:** Mrow! You're not allowed to speak with me!")
				return;
			}

			// Priority member

			console.log("-- Guild Response --");
			//message.channel.send(`> **ERROR:** I'm not quite ready to respond to you just yet! Mrow!`);
			// Set typing status
			message.channel.sendTyping();
			try {
				let prompt = message.content.replace(/<@!?\d+>/g, '').trim();
				// Add username User: to prompt
				prompt = `[${message.createdAt}] ${message.author.username}: ${prompt}`;
				const answer = await ask(prompt, history); //prompt GPT-3
				//Edit the message to include the response
				message.channel.send(answer)
			} catch {
				message.channel.send("> **ERROR:** Oops something went wrong! Mrow!")
			}
		}
	}
});

// Log in to Discord with your client's token
client.login(discord_token);