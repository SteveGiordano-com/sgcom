import dotenv from "dotenv";

dotenv.config();

const configObj = {
	"port": process.env.PORT,
	"environment": process.env.NODE_ENV,
	"redisUrl": process.env.REDIS_TLS_URL,
	"sessionSecret": process.env.SESSION_SECRET,
	"googleId": process.env.GOOGLE_CLIENT_ID,
	"googleSecret": process.env.GOOGLE_CLIENT_SECRET,
	"twitterUser": process.env.TWITTER_USER,
	"twitterPassword": process.env.TWITTER_PASSWORD
};

export default Object.freeze(configObj);
