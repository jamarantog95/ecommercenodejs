
class AppError extends Error {
    // El constructor recibe el mensaje de error y el codigo de estado
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "error" : "fail";
        // Error Operacional
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;