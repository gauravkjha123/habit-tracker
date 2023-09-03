import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = createLogger({
  level: 'silly', // Set the lowest log level to 'silly' to include all levels
  format: format.combine(
    format.timestamp(), // Add timestamps to logs
    format.json() // Format logs as JSON
  ),
  transports: [
    new transports.Console(), // Log to the console 
    new DailyRotateFile({
      dirname: 'logs', // Directory where log files will be stored
      filename: 'application-%DATE%.log', // Log file name pattern (with date placeholder)
      datePattern: 'YYYY-MM-DD', // Date format for file rotation
      zippedArchive: true, // Compress old log files
      maxSize: '20m', // Maximum log file size before rotation
      maxFiles: '14d', // Maximum number of log files to keep (14 days)
    }),
  ],
});

export default logger;
