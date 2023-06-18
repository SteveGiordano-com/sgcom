import crypto from "node:crypto";
import redisClient from "../server/cache.js";
import RedisStore from "connect-redis";
import configObj from "./env.config.js";

const { sessionSecret, environment } = configObj;
const oneMonth = 30 * 24 * 60 * 60 * 1000;

const sessionObj = {
	"name": "sgcom_session",
	"genid": () => {
		const uuid = crypto.randomUUID();
		return uuid;
	},
	"secret": sessionSecret,
	"resave": true,
	"saveUninitialized": false,
	"cookie": {
		"secure": environment === "production",
		"maxAge": oneMonth,
		"httpOnly": true,
		"sameSite": true
	},
	"store": new RedisStore({
		"client": redisClient
	})
};

export default sessionObj;
