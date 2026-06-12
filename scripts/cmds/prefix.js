const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "2.0",
		author: "ABIR",
		countDown: 5,
		role: 0,
		description: "Change bot prefix",
		category: "config",
		guide: {
			en:
				"{pn} <new prefix>: change prefix in your chat" +
				"\nExample:" +
				"\n{pn} #" +
				"\n\n{pn} <new prefix> -g: change system prefix (admin only)" +
				"\nExample:" +
				"\n{pn} # -g" +
				"\n\n{pn} reset: reset to default prefix"
		}
	},

	langs: {
		en: {
			reset: "✅ Your prefix has been reset to default: %1",
			onlyAdmin: "❌ Only bot admin can change system prefix",
			confirmGlobal: "⚠️ React to confirm changing SYSTEM prefix",
			confirmThisThread: "⚠️ React to confirm changing GROUP prefix",
			successGlobal: "✅ System prefix changed to: %1",
			successThisThread: "✅ Group prefix changed to: %1"
		}
	},

	onStart: async function ({
		message,
		role,
		args,
		commandName,
		event,
		threadsData,
		getLang
	}) {

		if (!args[0])
			return message.SyntaxError();

		if (args[0] == "reset") {
			await threadsData.set(
				event.threadID,
				null,
				"data.prefix"
			);

			return message.reply(
				getLang(
					"reset",
					global.GoatBot.config.prefix
				)
			);
		}

		const newPrefix = args[0];

		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g") {
			if (role < 2)
				return message.reply(
					getLang("onlyAdmin")
				);

			formSet.setGlobal = true;
		}
		else {
			formSet.setGlobal = false;
		}

		return message.reply(
			args[1] === "-g"
				? getLang("confirmGlobal")
				: getLang("confirmThisThread"),

			(err, info) => {
				formSet.messageID =
					info.messageID;

				global.GoatBot.onReaction.set(
					info.messageID,
					formSet
				);
			}
		);
	},

	onReaction: async function ({
		message,
		threadsData,
		event,
		Reaction,
		getLang
	}) {

		const {
			author,
			newPrefix,
			setGlobal
		} = Reaction;

		if (event.userID !== author)
			return;

		if (setGlobal) {
			global.GoatBot.config.prefix =
				newPrefix;

			fs.writeFileSync(
				global.client.dirConfig,
				JSON.stringify(
					global.GoatBot.config,
					null,
					2
				)
			);

			return message.reply(
				getLang(
					"successGlobal",
					newPrefix
				)
			);
		}
		else {
			await threadsData.set(
				event.threadID,
				newPrefix,
				"data.prefix"
			);

			return message.reply(
				getLang(
					"successThisThread",
					newPrefix
				)
			);
		}
	},

	onChat: async function ({
		event,
		message
	}) {

		if (
			event.body &&
			event.body.toLowerCase() ===
				"prefix"
		) {

			const systemPrefix =
				global.GoatBot.config.prefix;

			const boxPrefix =
				utils.getPrefix(
					event.threadID
				);

			return message.reply(
`Hey 

🌐 System prefix: ${systemPrefix}
🛸 Your box chat prefix: ${boxPrefix}

ʙᴜᴛᴛᴇʀꜰʟʏ ᴀʟᴡᴀʏꜱ ʜᴇʀᴇ ꜰᴏʀ ᴜʀ ꜱᴇʀᴠɪᴄᴇ`
			);
		}
	}
};
