import ServiceTemplate from "./_template.js";
import redisClient from "../../../server/cache.js";

const TABLE = "tweets";

// Change to time until midnight
const limit = 86400;

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

		await redisClient.set("allTweets", JSON.stringify(results), "EX", limit);

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

		await redisClient.set("uniqueDates", JSON.stringify(results), "EX", limit);

		return results;
	};

	getById = async (id) => {
		const cachedResults = await redisClient.get(id);

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient[this.table].findUnique({
			"where": {
				"id": id
			}
		});

		const allTweets = await this.getAll();
		const allTweetsArray = allTweets.map((tweet) => tweet.id);
		const tweetIndex = allTweetsArray.indexOf(id);
		const prev = allTweetsArray[tweetIndex - 1];
		const next = allTweetsArray[tweetIndex + 1];

		await redisClient.set(
			id,
			JSON.stringify({ results, prev, next, tweetIndex }),
			"EX",
			limit
		);

		return { results, prev, next, tweetIndex };
	};

	getByDate = async (date) => {
		const cachedResults = await redisClient.get(date);

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient
			.$queryRaw`SELECT * FROM tweets WHERE TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') = ${date} ORDER BY created_at ASC;`;

		const uniqueDates = await this.getUniqueDates();
		const uniqueDatesArray = uniqueDates.map((dates) => dates.date);
		const dateIndex = uniqueDatesArray.indexOf(date);
		const prev = uniqueDatesArray[dateIndex - 1];
		const next = uniqueDatesArray[dateIndex + 1];

		await redisClient.set(
			date,
			JSON.stringify({ results, prev, next }),
			"EX",
			limit
		);

		return { results, prev, next };
	};

	getFirstDayOfYear = async () => {
		const cachedResults = await redisClient.get("firstDayOfYear");

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient
			.$queryRaw`SELECT DISTINCT ON (year) date, year FROM (SELECT TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') as date, SUBSTRING(TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD'), 1, 4) as year FROM tweets ORDER BY date) AS a ORDER BY year;`;

		await redisClient.set(
			"firstDayOfYear",
			JSON.stringify(results),
			"EX",
			limit
		);

		return results;
	};

	getByKeyword = async (keyword) => {
		const cachedResults = await redisClient.get(keyword);

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient[this.table].findMany({
			"where": {
				"text": {
					"contains": keyword,
					"mode": "insensitive"
				}
			},
			"orderBy": {
				"created_at": "asc"
			}
		});

		await redisClient.set(keyword, JSON.stringify(results), "EX", limit);

		return results;
	};
}

export default new TweetService(TABLE);
