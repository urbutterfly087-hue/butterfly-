module.exports = {
  config: {
    name: "tag",
    version: "2.0",
    author: "ABIR",
    role: 0,
    shortDescription: {
      en: "Tag user with reason"
    },
    longDescription: {
      en: "Tag user by name and show reason"
    },
    category: "box chat",
    guide: {
      en: "{p}tag <name> <reason>"
    }
  },

  onStart: async function ({
    event,
    message,
    args,
    api
  }) {

    const threadID = event.threadID;

    if (args.length < 2) {
      return message.reply(
        "❌ Usage:\n/tag <name> <reason>"
      );
    }

    try {
      const threadInfo =
        await api.getThreadInfo(
          threadID
        );

      const members =
        threadInfo.userInfo || [];

      // first arg = name
      const nameInput =
        args[0].toLowerCase();

      // rest = reason
      const reason =
        args.slice(1).join(" ");

      // better matching
      const matchedUser =
        members.find(user =>
          user.name
            ?.toLowerCase()
            .includes(nameInput)
        );

      if (!matchedUser) {
        return message.reply(
          `❌ No user found with name: ${args[0]}`
        );
      }

      return message.reply({
        body:
`╭──〔 𝗧𝗔𝗚 𝗨𝗦𝗘𝗥 〕──⭓
│ 👤 User: @${matchedUser.name}
│ 📌 Reason: ${reason}
╰────────────⭓`,
        mentions: [
          {
            id: matchedUser.id,
            tag: `@${matchedUser.name}`
          }
        ]
      });

    } catch (err) {
      console.error(err);

      return message.reply(
        "❌ Failed to fetch group members."
      );
    }
  }
};
