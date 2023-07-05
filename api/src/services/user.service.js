import crypto from "node:crypto";
import ServiceTemplate from "./_template.js";

const TABLE = "users";

class UserService extends ServiceTemplate {
    constructor(table) {
        super(table);
    }

    getById = async (id) => {
        const results = await this.prismaClient.$queryRaw`
            SELECT * FROM users WHERE id = ${id};
        `;

        if (!results.length) {
            return null;
        }

        return results[0];
    };

    getByEmail = async (email) => {
        const results = await this.prismaClient.$queryRaw`
            SELECT * FROM users WHERE email = ${email};
        `;

        if (!results.length) {
            return null;
        }

        return results[0];
    };

    createUser = async (email) => {
        const userId = crypto.randomUUID();
        const results = await this.prismaClient.$queryRaw`
            INSERT INTO users (id, email) VALUES
            (${userId}, ${email}) RETURNING id, email;
        `;

        return results[0];
    };
};

export default new UserService(TABLE);