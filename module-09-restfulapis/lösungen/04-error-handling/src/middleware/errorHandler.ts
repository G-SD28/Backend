import type { ErrorRequestHandler } from 'express';
import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const LOG_DIR = 'log';

function getLogFilePath(): string {
  const date = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  return join(LOG_DIR, `${date}-error.log`);
}

async function writeToLog(err: Error, req: { method: string; path: string }, status: number): Promise<void> {
  const entry = `[${new Date().toISOString()}] ${req.method} ${req.path} — ${status}: ${err.message}\n${err.stack ?? ''}\n`;
  await mkdir(LOG_DIR, { recursive: true })
    .then(() => appendFile(getLogFilePath(), entry, 'utf-8'))
    .catch(() => {});
}

export const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  const status: number =
    typeof err.status === 'number' ? err.status
    : typeof err.statusCode === 'number' ? err.statusCode
    : 500;

  const message: string = err.message ?? 'Internal Server Error';

  await writeToLog(err, req, status);

  res.status(status).json({ message });
};
