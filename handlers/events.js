const { events } = require("../validation/eventNames");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

/**
 *
 * @param client
 * @returns {Promise<void>}
 */
module.exports = async (client) => {
  const table = new Ascii("Events Loaded");

  (await PG(`${process.cwd()}/events/*.js`)).map(async (file) => {
    const event = require(file);
    if (!events.includes(event.name) || !event.name) {
      const l = file.split("/");
      await table.addRow(
        `${events.name || "Missing"}`,
        `⚠ Event Name is either invalid or missing ${l[6] + `/` + l[7]}`
      );
      return;
    }

    if (event.once)
      client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));

    await table.addRow(event.name, "✔ Successful");
  });

  console.log(table.toString());

  client.on('raw', packet =>  {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = client.channels.cache.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.cache.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.messages.fetch(packet.d.message_id).then(message => {
      // Emojis can have identifiers of name:id format, so we have to account for that case as well
      const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
      // This gives us the reaction we need to emit the event properly, in top of the message object
      const reaction = message.reactions.cache.get(emoji);
      // Adds the currently reacting user to the reaction's users collection.
      if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
      // Check which type of event it is before emitting
      if (packet.t === 'MESSAGE_REACTION_ADD') {
        client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
      }
      if (packet.t === 'MESSAGE_REACTION_REMOVE') {
        client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
      }
    });
  });
};
