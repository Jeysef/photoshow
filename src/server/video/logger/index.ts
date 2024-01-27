import { type LoggerEmoji, type LoggerState } from "./enums";

class Logger {
    private static instance: Logger;

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public log = (state: LoggerState, emoji: LoggerEmoji, message: string) => {
        console.log(`${state}${emoji} ${message}\x1b[0m`);
    };
}

export default Logger.getInstance();