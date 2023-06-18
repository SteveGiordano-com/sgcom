import redis from "redis";
import configObj from "../configs/env.config.js";
const { redisURL } = configObj;

const redisClient = redis.createClient({
	"url": redisURL
});

redisClient.on("error", (error) => {
	console.error(`Redis: ${error}`);
});

try {
	await redisClient.connect();
} catch (error) {
	console.log(error);
}

export default redisClient;
