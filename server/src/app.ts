import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { ENV, CORS, UPLOADS_DIR } from './config/index.js';
import { connectDatabase } from './database/index.js';
import { apiLimiter, errorHandler, notFoundHandler } from './middleware/index.js';
import { seedAdmin } from './utils/index.js';
import { APP_NAME, APP_VERSION } from './constants/index.js';
import routes from './routes/index.js';

const app = express();

// Security
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(cors(CORS));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging
if (ENV.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      skip: (_req, res) => res.statusCode < 400,
    }),
  );
}

// Rate limiting
app.use(apiLimiter);

// Static files
app.use('/uploads', express.static(UPLOADS_DIR));

// API versioning
const API_PREFIX = `/api/${ENV.apiVersion}`;
app.use(API_PREFIX, routes);

// Fallback health check at root
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    name: APP_NAME,
    version: APP_VERSION,
    environment: ENV.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function start(): Promise<void> {
  try {
    await connectDatabase();
    await seedAdmin();

    app.listen(ENV.port, () => {
      console.log(
        `[Server] ${APP_NAME} v${APP_VERSION}`,
      );
      console.log(
        `[Server] Running on http://localhost:${ENV.port} in ${ENV.nodeEnv} mode`,
      );
      console.log(
        `[Server] API available at http://localhost:${ENV.port}${API_PREFIX}`,
      );
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

start();

export default app;