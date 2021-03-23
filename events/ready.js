const { version } = require("./../config/config.json");
module.exports = (client) => {
  console.log(`Logged in as user ${client.user.tag}!`);
  client.user.setActivity("Version: " + version);
};
