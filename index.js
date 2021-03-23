const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const {
  token,
  prefix,
  defaultCooldownAmount,
} = require("./config/config.json");
const AsciiTable = require("ascii-table/ascii-table");
const evtTable = new AsciiTable("Events");

const cooldowns = new Discord.Collection();

// Command Handler
client.commands = new Discord.Collection();

const cmdFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of cmdFiles) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.name, cmd);
}

// Commands or something
client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!client.commands.has(command.name)) return;

  if (!command) return;

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}`;
    }
    return message.channel.send(reply);
  }
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  if (
    command.permission &&
    !message.member.permissions.cache.has(command.permission)
  ) {
    return message.reply(`No permission! Required: ${command.permission}`);
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || defaultCooldownAmount) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply();
  }
});

fs.readdir("./events/", (err, files) => {
  if (err) {
    evtTable.addRow("Unloaded event", "❌");
    console.error(err);
  }
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const evt = require(`./events/${file}`);
    let evtName = file.split(".")[0];
    evtTable.addRow(`${evtName}`, "✅");
    client.on(evtName, evt.bind(null, client));
  });
});

// Showing evtTable
console.log(evtTable.toString());

client.login(token);
