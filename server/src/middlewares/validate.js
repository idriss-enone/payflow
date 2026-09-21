export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            return res.status(400).json({
                message: "Des erreurs de validation sont survenues.",
                errors,
            });
        }

        req.body = result.data;
        next();
    };
}