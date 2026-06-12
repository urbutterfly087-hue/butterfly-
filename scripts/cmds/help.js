  module.exports = {
  config: {
    name: "help",
    aliases: ["h"],
    version: "1.0",
    role: 0,
    author: "MahMuD",
    shortDescription: {
      en: "Show commands list"
    },
    longDescription: {
      en: "View all commands or details of a specific command"
    },
    guide: {
      en: "{p}help [command name]"
    }
  },

  onStart: async function ({
    message,
    args,
    commands,
    aliases,
    prefix
  }) {

    // Show all commands
    if (!args[0]) {
      let msg = `╭───〔 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 〕───⭓\n`;

      const categories = {};

      commands.forEach((command) => {
        const category =
          command.config.category || "info";

        if (!categories[category]) {
          categories[category] = {
            commands: []
          };
        }

        categories[category].commands.push(
          command.config.name
        );
      });

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭─────⭓ ${category.toUpperCase()}`;

          const names =
            categories[category].commands.sort();

          for (let i = 0; i < names.length; i += 2) {
            const cmds = names
              .slice(i, i + 2)
              .map((item) => `✧ ${item}`);

            msg += `\n│ ${cmds.join("    ")}`;
          }

          msg += `\n╰────────────⭓`;
        }
      });

      const totalCommands = commands.size;

      msg += `\n\n⭔ Bot has ${totalCommands} commands`;
      msg += `\n⭔ Type ${prefix}help <command name> to learn usage`;
      msg += `\n\n╭─✦ADMIN: 𝗔𝗕𝗜𝗥彡`;
      msg += `\n╰────────────⭓`;

      try {
        const hh = await message.reply({
          body: msg
        });

        // Auto unsend after 80 sec
        setTimeout(() => {
          message.unsend(hh.messageID);
        }, 80000);

      } catch (error) {
        console.error(
          "Error sending help message:",
          error
        );
      }

    } else {
      // Specific command help
      const commandName =
        args[0]?.toLowerCase();

      const command =
        commands.get(commandName) ||
        commands.get(
          aliases.get(commandName)
        );

      if (!command) {
        return await message.reply(
          `❌ Command "${commandName}" not found.\nTry: ${prefix}help`
        );
      }

      const configCommand =
        command.config;

      const roleText =
        roleTextToString(
          configCommand.role
        );

      const longDescription =
        configCommand.longDescription?.en ||
        "No description";

      const guideBody =
        configCommand.guide?.en ||
        "No guide available.";

      const usage = guideBody
        .replace(/{p}/g, prefix)
        .replace(
          /{n}/g,
          configCommand.name
        );

      const response =
`╭─────────⭓
│ 🎀 NAME: ${configCommand.name}
│ 📃 ALIASES: ${
  configCommand.aliases
    ? configCommand.aliases.join(", ")
    : "None"
}
├──‣ INFO
│ 📝 DESCRIPTION: ${longDescription}
│ 👑 ADMIN: 𝗠𝗮𝗵𝗠𝘂𝗗
│ 📚 GUIDE: ${usage}
├──‣ USAGE
│ ⭐ VERSION: ${
  configCommand.version ||
  "1.0"
}
│ ♻️ ROLE: ${roleText}
╰────────────⭓`;

      const helpMessage =
        await message.reply(
          response
        );

      setTimeout(() => {
        message.unsend(
          helpMessage.messageID
        );
      }, 80000);
    }
  }
};

function roleTextToString(role) {
  switch (role) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}    
