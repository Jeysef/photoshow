import { env } from "@/env";
import { LoggerState, type LoggerEmoji } from "./enums";

class Logger {
    private static instance: Logger;

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public log = (state: LoggerState, emoji: LoggerEmoji, message: string) => {
        if (state === LoggerState.DEBUG && env.NODE_ENV !== "development") return;
        console.log(`${state}${emoji} ${message}\x1b[0m`);
    };
}

export default Logger.getInstance();
