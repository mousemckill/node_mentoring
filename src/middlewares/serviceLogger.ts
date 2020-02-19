import * as expressWinston from "express-winston";
import winston from "winston";

expressWinston.requestWhitelist.push("body");
expressWinston.responseWhitelist.push("body");

export const serviceLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  expressFormat: true,
  colorize: false
});
