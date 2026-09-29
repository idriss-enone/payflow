import { ZodError } from "zod";

export const notFoundHandler = (req, res) => {
    res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (error, req, res, next) => {
    console.error(error);

    if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            errors: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })), //errors: error.flatten(),
        });
    }

    if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Resource already exists" });
    }

    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: statusCode === 500 ? "Internal server error" : error.message,
        code: error.code || (statusCode === 500 ? "INTERNAL_ERROR" : "ERROR"),
    });
};