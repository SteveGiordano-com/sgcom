import dotenv from "dotenv";

dotenv.config();

const configObj = {
	"port": process.env.PORT,
	"environment": process.env.NODE_ENV,
	"redisUrl": process.env.REDIS_TLS_URL,
	"sessionSecret": process.env.SESSION_SECRET
};

console.log(process.env);

export default Object.freeze(configObj);
