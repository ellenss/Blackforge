import "dotenv/config";
import express from "express";
import redis from "redis";
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from "discord-interactions";
// import { getRandomEmoji, DiscordRequest } from "./utils.js";
import { addToQueue } from "./queue.js";
import {
  getCurrentColor,
  getAllColors,
  setColor,
  addColor,
  updateColorAmount,
} from "./colors.js";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async function (req, res) {
    // Interaction id, type and data
    const { type, member, data } = req.body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { user } = member;
      const { name } = data;

      switch (name) {
        case "queue":
          let username = user.username;
          let queue = addToQueue(username);
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              flags: InteractionResponseFlags.EPHEMERAL,
              content: `You are number ${queue.length} in the queue.`,
            },
          });

        case "color":
          switch (data.options[0].name) {
            case "current":
              let currentColor = getCurrentColor();
              if (!currentColor) currentColor = "not set";
              return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  flags: InteractionResponseFlags.EPHEMERAL,
                  content: `The current color is ${currentColor}.`,
                },
              });
            case "all":
              let colors = getAllColors();
              let colorStatus = colors
                .map((c) => `- ${c.name}: ${c.amount}`)
                .join("\n");
              if (!colorStatus) colorStatus = "No colors registered.";
              return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  flags: InteractionResponseFlags.EPHEMERAL,
                  content: `Status of all colors: \n ${colorStatus}.`,
                },
              });
            case "set":
              const newColor = data.options[0].options[0].value;
              setColor(newColor);
              return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  flags: InteractionResponseFlags.EPHEMERAL,
                  content: `The current color is now set to ${newColor}.`,
                },
              });
            case "new":
              const colorName = data.options[0].options[0].value;
              const colorAmount =
                parseInt(data.options[0].options[1].value) || 1;
              addColor(colorName, colorAmount);
              return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  flags: InteractionResponseFlags.EPHEMERAL,
                  content: `Registered new color: ${colorName}.`,
                },
              });
            case "update":
              const addColorName = data.options[0].options[0].value;
              const addColorAmount =
                parseInt(data.options[0].options[1].value) || 1;
              updateColorAmount(addColorName, addColorAmount);
              return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  flags: InteractionResponseFlags.EPHEMERAL,
                  content: `Added ${addAmount} to ${addColorName}.`,
                },
              });
            default:
              console.error(
                `unknown subcommand: ${data.options[0].name}`
              );
              return res
                .status(400)
                .json({ error: "unknown subcommand" });
          }
        
        default:
          console.error(`unknown command: ${name}`);
          return res.status(400).json({ error: "unknown command" });
      }
    }

    console.error("unknown interaction type", type);
    return res.status(400).json({ error: "unknown interaction type" });
  }
);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
