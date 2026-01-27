/**
 * Translation Service Manager
 * Manages the Python translation microservice as a child process
 * Automatically starts/stops the service with the API gateway
 */

import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { logger } from '../../../shared/logger.js';

const managerLogger = logger.prefixed('TranslationServiceManager');

class TranslationServiceManager {
  private process: ChildProcess | null = null;
  private isRunning = false;
  private readonly translationServicePath: string;
  private readonly pythonExecutable: string = process.platform === 'win32' ? 'python' : 'python3';

  constructor() {
    // In ES modules we use import.meta.url to get current directory
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    // On Windows pathname starts with /C:/..., we might need to strip the leading /
    const cleanDirname = process.platform === 'win32' && __dirname.startsWith('/')
      ? __dirname.slice(1)
      : __dirname;

    this.translationServicePath = path.join(
      cleanDirname,
      '../../translation-service'
    );
  }

  /**
   * Start the translation service
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      managerLogger.warn('Translation service is already running');
      return;
    }

    try {
      managerLogger.info('🚀 Starting translation service...');

      // Spawn Python process running the Flask app with unbuffered I/O
      // -u flag prevents stdout/stderr buffering issues in subprocess
      this.process = spawn(this.pythonExecutable, ['-u', 'app.py'], {
        cwd: this.translationServicePath,
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: false,
        env: {
          ...process.env,
          PYTHONUNBUFFERED: '1', // Prevent buffering
        },
      });

      // Handle process events
      this.process.on('error', (error: any) => {
        managerLogger.error('Failed to start translation service', error);
        this.isRunning = false;
      });

      this.process.on('exit', (code: number, signal: string) => {
        managerLogger.warn(
          `Translation service exited with code ${code}, signal ${signal}`
        );
        this.isRunning = false;
      });

      // Forward stdout and stderr
      this.process.stdout?.on('data', (data: Buffer) => {
        const message = data.toString().trim();
        if (message) {
          managerLogger.info(`[TranslationService] ${message}`);
        }
      });

      this.process.stderr?.on('data', (data: Buffer) => {
        const message = data.toString().trim();
        if (message) {
          managerLogger.error(`[TranslationService] ${message}`);
        }
      });

      this.isRunning = true;

      // Wait a bit for the service to start
      await new Promise((resolve) => setTimeout(resolve, 2000));

      managerLogger.info('✅ Translation service started successfully');
    } catch (error: any) {
      managerLogger.error('Error starting translation service', error);
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * Stop the translation service
   */
  stop(): void {
    if (!this.isRunning || !this.process) {
      return;
    }

    try {
      managerLogger.info('🛑 Stopping translation service...');

      if (this.process.pid) {
        process.kill(-this.process.pid, 'SIGTERM');
      } else {
        this.process.kill();
      }

      this.isRunning = false;
      managerLogger.info('✅ Translation service stopped');
    } catch (error: any) {
      managerLogger.error('Error stopping translation service', error);
    }
  }

  /**
   * Check if translation service is running
   */
  getStatus(): boolean {
    return this.isRunning;
  }
}

export const translationServiceManager = new TranslationServiceManager();
