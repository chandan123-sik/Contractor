// Smart Logger - Only logs in development mode
// In production, only errors are logged

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
    // Info logs - Only in development
    info: (...args) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },

    // Error logs - Always logged (important for debugging)
    error: (...args) => {
        console.error(...args);
    },

    // Warning logs - Always logged
    warn: (...args) => {
        console.warn(...args);
    },

    // Debug logs - Only in development
    debug: (...args) => {
        if (isDevelopment) {
            console.log('🔍 DEBUG:', ...args);
        }
    },

    // Success logs - Only in development
    success: (...args) => {
        if (isDevelopment) {
            console.log('✅', ...args);
        }
    }
};

export default logger;
