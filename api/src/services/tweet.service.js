import ServiceTemplate from "./_template.js";
import redisClient from "../../../server/cache.js";
import expiration from "../utils/expiration.js";
import convertDateAndTime from "../utils/convertDateAndTime.js";

const TABLE = "tweets";

class TweetService extends ServiceTemplate {
	constructor(table) {
		super(table);
	}

	getAll = async () => {
		const cachedResults = await redisClient.get("allTweets");

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient[this.table].findMany({
			"orderBy": {
				"created_at": "asc"
			}
		});

		await redisClient.set("allTweets", JSON.stringify(results), {
			"EX": expiration
		});

		return results;
	};

	getUniqueDates = async () => {
		const cachedResults = await redisClient.get("uniqueDates");

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient
			.$queryRaw`SELECT DISTINCT ON (TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD'))
		TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') AS date,
		COUNT(id) AS tweet_count
		FROM tweets
		GROUP BY TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD')
		ORDER BY TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') ASC;`;

		results.forEach((result) => {
			result.tweet_count = Number(result.tweet_count);
		});

		await redisClient.set("uniqueDates", JSON.stringify(results), {
			"EX": expiration
		});

		return results;
	};

	getById = async (id) => {
		const cachedResults = await redisClient.get(id);

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient
			.$queryRaw`SELECT id, text, CAST(created_at AS TEXT) AS created_at FROM tweets WHERE id = ${id};`;

		const allTweets = await this.getAll();
		const allTweetsArray = allTweets.map((tweet) => tweet.id);
		const tweetIndex = allTweetsArray.indexOf(id);
		const prev = allTweetsArray[tweetIndex - 1];
		const next = allTweetsArray[tweetIndex + 1];
		const { text, created_at } = results[0];
		const { convertedDate, convertedTime } = convertDateAndTime(
			results[0].created_at + ".000Z"
		);
		const resultsObj = {
			id,
			created_at,
			text,
			prev,
			next,
			tweetIndex,
			convertedDate,
			convertedTime
		};

		await redisClient.set(id, JSON.stringify(resultsObj), { "EX": expiration });

		return resultsObj;
	};

	getByDate = async (date) => {
		const cachedResults = await redisClient.get(date);

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient
			.$queryRaw`SELECT id, text, created_at AS created_at_orig, CAST(created_at AS TEXT) AS created_at FROM tweets WHERE TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') = ${date} ORDER BY created_at ASC;`;

		const friendlyDate = results[0].created_at_orig
			.toString()
			.split(" ")
			.slice(0, 4)
			.join(" ");

		results.forEach((result) => {
			delete result.created_at_orig;
			const { convertedDate, convertedTime } = convertDateAndTime(
				result.created_at + ".000Z"
			);
			result.createDate = convertedDate;
			result.createTime = convertedTime;
			result.friendlyDate = friendlyDate;
		});

		const uniqueDates = await this.getUniqueDates();
		const uniqueDatesArray = uniqueDates.map((dates) => dates.date);
		const dateIndex = uniqueDatesArray.indexOf(date);
		const prev = uniqueDatesArray[dateIndex - 1];
		const next = uniqueDatesArray[dateIndex + 1];

		await redisClient.set(date, JSON.stringify({ results, prev, next }), {
			"EX": expiration
		});

		return { results, friendlyDate, prev, next };
	};

	getFirstDayOfYear = async () => {
		const cachedResults = await redisClient.get("firstDayOfYear");

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient
			.$queryRaw`SELECT DISTINCT ON (year) date, year FROM (SELECT TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') as date, SUBSTRING(TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD'), 1, 4) as year FROM tweets ORDER BY date) AS a ORDER BY year;`;

		await redisClient.set("firstDayOfYear", JSON.stringify(results), {
			"EX": expiration
		});

		return results;
	};

	getByKeyword = async (keyword) => {
		const cachedResults = await redisClient.get(keyword);

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient
			.$queryRaw`SELECT id, text, CAST(created_at AS TEXT) AS created_at FROM tweets WHERE text ILIKE '%blear%' ORDER BY created_at ASC;`;

		results.forEach((result) => {
			const { convertedDate, convertedTime } = convertDateAndTime(
				result.created_at + ".000Z"
			);
			result.createDate = convertedDate;
			result.createTime = convertedTime;
		});

		await redisClient.set(keyword, JSON.stringify(results), {
			"EX": expiration
		});

		return results;
	};
}

export default new TweetService(TABLE);
