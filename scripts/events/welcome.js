const { getTime } = global.utils;

module.exports = {
    config: {
        name: "welcome",
        version: "4.0",
        author: "ABIR EDIT",
        category: "events"
    },

    onStart: async function ({ threadsData, message, event, api }) {
        if (event.logMessageType !== "log:subscribe") return;

        const threadID = event.threadID;
        const threadData = await threadsData.get(threadID);
        const threadName = threadData.threadName;

        const addedMembers = event.logMessageData.addedParticipants;
        const addedBy = event.author;

        // Fetch adder info
        const adderInfo = await api.getUserInfo(addedBy);
        const addedByName = adderInfo[addedBy].name;

        for (const user of addedMembers) {
            const name = user.fullName;
            const uid = user.userFbId;

            const text =
`ʜᴇʏ ${🌸name🌸}
━━━━━━━━━━━━━━━━━━━━━━━
ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ: ${threadName🤗}
━━━━━━━━━━━━━━━━━━━━━━━
ᴜɪᴅ: ${uid}
━━━━━━━━━━━━━━━━━━━━━━━
ᴀᴅᴅ ʙʏ: ${addedByName}
━━━━━━━━━━━━━━━━━━━━━━━`;

            message.send({
                body: text,
                mentions: [{ tag: name, id: uid }]
            });
        }
    }
};
