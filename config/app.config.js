const { MemoryStore } = require('express-rate-limit')
const { transports, format } = require('winston')
const { combine, timestamp, json } = format
const multer = require('multer')
const path = require('path')
const ASSETS_DIR = path.resolve(__dirname, '../../assets')
const NODE_MODULES_DIR = path.resolve(__dirname, '../../node_modules')
const { DB_KEY, JWT_ACCESS_TOKEN_KEY, JWT_REFRESH_TOKEN_KEY, NODE_ENV } =
  process.env

const bearerAuthenticationScheme = 'Bearer'
const accessTokenExpiresIn = 30 * 60 // 30 minutes (in seconds)
const refreshTokenExpiresIn = 7 * 24 * 60 * 60 // 7 days (in seconds)

module.exports = {
  assetsDir: ASSETS_DIR,
  nodeModulesDir: NODE_MODULES_DIR,
  upload: multer({
    storage: multer.memoryStorage(),
    // limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
      const filetypes = /application\/pdf|image\/jpeg|image\/png/
      const mimetype = filetypes.test(file.mimetype)
      const extname = /pdf|jpg|jpeg|png/.test(
        path.extname(file.originalname).toLowerCase(),
      )

      if (!mimetype || !extname) {
        return cb(new Error('Unsupported file type'))
      }

      return cb(null, true)
    },
  }),
  dbKey: DB_KEY,
  bearerAuthenticationScheme,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
  jwtAccessTokenKey:  process.env.JWT_ACCESS_TOKEN_KEY,
  jwtAccessTokenOptions: {
    algorithm: 'HS256',
    expiresIn: accessTokenExpiresIn,
  },
  jwtRefreshTokenKey:  process.env.JWT_REFRESH_TOKEN_KEY,
  jwtRefreshTokenOptions: {
    algorithm: 'HS256',
    expiresIn: refreshTokenExpiresIn,
  },
  refreshTokenCookieOptions: {
    httpOnly: true,
    secure: (NODE_ENV || 'development').toLowerCase() === 'production',
    sameSite: 'Lax',
    maxAge: refreshTokenExpiresIn * 1000,
    path: '/api/v1/account/token/refresh',
  },
  saltOrRounds: 10,
  loggerOptions: {
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [
      new transports.Console(),
      /* new transports.Console({
        format: printf(({ message }) => message)
      }), */
      new transports.File({ filename: 'logs/combined.log' }),
    ],
  },
  winstonLoggerOptions: {
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [
      // new transports.Console(),
      new transports.File({ filename: 'logs/http.log' }),
    ],
  },
  expressRateLimitOptions: {
    windowMs: 60 * 1000,
    max: 20,
    message: 'Too Many Requests',
    statusCode: 429,
    legacyHeaders: true,
    standardHeaders: false,
    requestPropertyName: 'rateLimit',
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
    store: new MemoryStore(),
  },
  corsOptions: {
    origin: 'http://localhost:5173', // Explicitly allow frontend origin or use '*'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
  apicacheOptions: {
    defaultDuration: '5 minutes',
    // eslint-disable-next-line no-unused-vars
    appendKey: (req, res) => req.url,
    headerBlacklist: [],
    statusCodes: {
      exclude: [],
      include: [],
    },
    headers: {
      // 'cache-control': 'no-cache',
    },
    respectCacheControl: true,
  },
  expressJSONOptions: {
    limit: '10mb',
    strict: true,
    type: 'application/json',
  },
  expressURLEncodedOptions: {
    limit: '10mb',
    extended: true,
    parameterLimit: 1000,
  },
    saltOrRounds: 10,
}
