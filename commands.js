import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";

const QUEUE_COMMAND = {
  name: "queue",
  description: "Join the printing queue",
  type: 1,
  integration_types: [0],
  contexts: [0],
};

const COLOR_COMMAND = {
  name: "color",
  description: "Get color status or input a new color",
  type: 1,
  integration_types: [0],
  contexts: [0],
  options: [
    {
      name: "current",
      description: "Get the current color",
      type: 1,
    },
    {
      name: "all",
      description: "Get status of all colors",
      type: 1,
    },
    {
      name: "set",
      description: "Set the current color",
      type: 1,
      options: [
        {
          name: "color",
          description: "Choose the color",
          type: 3,
          required: true,
          autocomplete: true,
        },
      ],
    },
    {
      name: "new",
      description: "Register a new color",
      type: 1,
      options: [
        {
          name: "color",
          description: "Input a color name",
          type: 3,
          required: true,
        },
        {
          name: "amount",
          description: "Input amount of spools to add",
          type: 4,
          required: false,
        },
      ],
    },
    {
      name: "update",
      description: "Add a new spool of existing color",
      type: 1,
      options: [
        {
          name: "color",
          description: "Choose the color",
          type: 3,
          required: true,
          autocomplete: true,
        },
        {
          name: "amount",
          description: "Input amount of spools to add",
          type: 4,
          required: false,
        },
      ],
    }
  ],
};

const ALL_COMMANDS = [QUEUE_COMMAND, COLOR_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
