export default class {
    static success(data, meta = {}) {
        return {
            success: true,
            data,
            meta,
        };
    }
    static error(message, code = 400) {
        return {
            success: false,
            error: {
                code,
                message,
            },
        };
    }
}
