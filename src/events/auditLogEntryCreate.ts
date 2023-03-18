import {
  Events,
  Guild,
  GuildAuditLogsEntry,
} from "discord.js";
import { EventFile } from "@myTypes/index";

export default {
  name: Events.GuildAuditLogEntryCreate,
  once: false,
  execute(entry: GuildAuditLogsEntry, guild: Guild) {
    if (entry.targetType === "Message") {
      console.log("Target Type is a message");

      if (entry.actionType === "Delete") {
        console.log("A message was deleted");

        console.log(entry.executor?.username);
        console.log(entry.targetId);
        console.log(entry.extra);
        console.log(entry.changes);
      }
    }
  },
} as EventFile;
