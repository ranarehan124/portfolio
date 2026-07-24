import fs from 'node:fs';
import path from 'node:path';

class Logger {
  private logDir: string;

  constructor(logDir: string) {
    this.logDir = logDir;
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  private write(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level}] ${message}\n`;

    if (process.env.NODE_ENV === 'development') {
      console.log(entry.trim());
      return;
    }

    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDir, `${date}.log`);
    fs.appendFileSync(logFile, entry, 'utf-8');
  }

  info(message: string): void {
    this.write('INFO', message);
  }

  warn(message: string): void {
    this.write('WARN', message);
  }

  error(message: string): void {
    this.write('ERROR', message);
  }
}

export const logger = new Logger(
  path.resolve(process.cwd(), 'src/logs'),
);