import ServiceTemplate from "./_template.js";
import redisClient from "../../../server/cache.js";
import expiration from "../utils/expiration.js";

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
		let source = "db";

		if (cachedResults) {
			const results = JSON.parse(cachedResults);
			source = "cache";
			return { results, source, expiration };
		}

		const results = await this.prismaClient
			.$queryRaw`SELECT DISTINCT ON (TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD'))
		TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD') AS date,
		COUNT(id) AS tweet_count
		FROM tweets
		GROUP BY TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD')
		ORDER BY TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD') ASC;`;

		results.forEach((result) => {
			result.tweet_count = Number(result.tweet_count);
		});

		await redisClient.set("uniqueDates", JSON.stringify(results), {
			"EX": expiration
		});

		return { results, source, expiration };
	};

	getBetweenDates = async (startDate, endDate) => {
		const cachedResults = await redisClient.get(
			`betweenDates${startDate}${endDate}`
		);

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient
			.$queryRaw`SELECT DISTINCT ON (TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD'))
		TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD') AS date,
		COUNT(id) AS tweet_count
		FROM tweets
		WHERE TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD') BETWEEN ${startDate} AND ${endDate}
		GROUP BY TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD')
		ORDER BY TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD') ASC;`;

		results.forEach((result) => {
			result.tweet_count = Number(result.tweet_count);
		});

		await redisClient.set(
			`betweenDates${startDate}${endDate}`,
			JSON.stringify(results),
			{
				"EX": expiration
			}
		);

		return results;
	};

	getById = async (id) => {
		const cachedResults = await redisClient.get(id);

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient.$queryRaw`SELECT 
			id,
			text,
			TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD') AS create_date, 
			TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'HH:MI:SS') AS create_time, 
			TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'Mon DD, YYYY') AS friendly_date,
			CASE 
				WHEN (CAST(TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'HH24') AS INT) >= 12) THEN 'PM' 
				ELSE 'AM'
			END AS meridiem
			FROM tweets
		 	WHERE id = ${id};`;

		if (!results.length) {
			return null;
		}

		const allTweets = await this.getAll();
		const allTweetsArray = allTweets.map((tweet) => tweet.id);
		const tweetIndex = allTweetsArray.indexOf(id);
		const prev = allTweetsArray[tweetIndex - 1];
		const next = allTweetsArray[tweetIndex + 1];
		const { text, create_date, create_time, friendly_date, meridiem } =
			results[0];

		const resultsObj = {
			id,
			text,
			prev,
			next,
			tweetIndex,
			create_date,
			create_time,
			friendly_date,
			meridiem
		};

		await redisClient.set(id, JSON.stringify(resultsObj), { "EX": expiration });

		return resultsObj;
	};

	getByDate = async (date) => {
		const cachedResults = await redisClient.get(date);

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient.$queryRaw`
			SELECT 
			id,
			text,
			TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD') AS create_date, 
			TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'HH:MI:SS') AS create_time, 
			TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'Mon DD, YYYY') AS friendly_date,
			CASE 
				WHEN (CAST(TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'HH24') AS INT) >= 12) THEN 'PM' 
				ELSE 'AM'
			END AS meridiem
			FROM tweets
			WHERE TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD') = ${date} ORDER BY created_at ASC;`;

		if (!results.length) {
			return null;
		}

		const uniqueDatesAll = await this.getUniqueDates();
		const uniqueDates = uniqueDatesAll.results;
		const uniqueDatesArray = uniqueDates.map((dates) => dates.date);
		const dateIndex = uniqueDatesArray.indexOf(date);
		const prev = uniqueDatesArray[dateIndex - 1];
		const next = uniqueDatesArray[dateIndex + 1];
		const friendlyDate = results[0].friendly_date;

		results.forEach((result) => {
			result.createDate = result.create_date;
			result.createTime = result.create_time + result.meridiem;

			delete result.create_date;
			delete result.create_time;
			delete result.friendly_date;
		});

		const resultsObj = { results, friendlyDate, prev, next };

		await redisClient.set(date, JSON.stringify(resultsObj), {
			"EX": expiration
		});

		return resultsObj;
	};

	getFirstDayOfYear = async () => {
		const cachedResults = await redisClient.get("firstDayOfYear");

		if (cachedResults) {
			return JSON.parse(cachedResults);
		}

		const results = await this.prismaClient
			.$queryRaw`SELECT DISTINCT ON (year) date, year FROM (SELECT TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD') as date, SUBSTRING(TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD'), 1, 4) as year FROM tweets ORDER BY date) AS a ORDER BY year;`;

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

		const sqlKeyword = `%${keyword}%`;

		const results = await this.prismaClient.$queryRaw`SELECT 
				id, 
				text, 
				TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'YYYY-MM-DD') AS create_date, 
				TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'HH:MI:SS') AS create_time,
				CASE 
					WHEN (CAST(TO_CHAR(created_at AT TIME ZONE 'GMT-06:00 DST', 'HH24') AS INT) >= 12) THEN 'PM' 
				ELSE 'AM'
				END AS meridiem
			FROM tweets WHERE text ILIKE ${sqlKeyword} ORDER BY created_at ASC;`;

		results.forEach((result) => {
			result.createDate = result.create_date;
			result.createTime = result.create_time + result.meridiem;

			delete result.create_date;
			delete result.create_time;
			delete result.meridiem;
		});

		await redisClient.set(keyword, JSON.stringify(results), {
			"EX": expiration
		});

		return results;
	};
}

export default new TweetService(TABLE);
