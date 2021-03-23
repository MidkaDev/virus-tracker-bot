module.exports = {
  name: "example",
  description: "Example Command",
  args: true,
  usage: "example",
  guildOnly: true,
  cooldown: 5,
  permission: ["KICK_MEMBERS"],
  execute(message, args) {
    message.channel.send("Example.");
  },
};
