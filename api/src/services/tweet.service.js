import ServiceTemplate from "./_template.js";
const TABLE = "tweets";

class TweetService extends ServiceTemplate {
	constructor(table) {
		super(table);
	}

	getAll = async () => {
		const result = await this.prismaClient[this.table].findMany({
			"orderBy": {
				"created_at": "asc"
			}
		});
		return result;
	};

	getUniqueDates = async () => {
		const result = await this.prismaClient
			.$queryRaw`SELECT DISTINCT ON (TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD'))
		TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') AS date,
		COUNT(id) AS tweet_count
		FROM tweets
		GROUP BY TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD')
		ORDER BY TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') ASC;`;

		return result;
	};

	getById = async (id) => {
		const result = await this.prismaClient[this.table].findUnique({
			"where": {
				"id": id
			}
		});

		const allTweets = await this.getAll();
		const allTweetsArray = allTweets.map((tweet) => tweet.id);
		const tweetIndex = allTweetsArray.indexOf(id);
		const prev = allTweetsArray[tweetIndex - 1];
		const next = allTweetsArray[tweetIndex + 1];
		return { result, prev, next, tweetIndex };
	};

	getByDate = async (date) => {
		const results = await this.prismaClient
			.$queryRaw`SELECT * FROM tweets WHERE TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') = ${date} ORDER BY created_at ASC;`;

		const uniqueDates = await this.getUniqueDates();
		const uniqueDatesArray = uniqueDates.map((dates) => dates.date);
		const dateIndex = uniqueDatesArray.indexOf(date);
		const prev = uniqueDatesArray[dateIndex - 1];
		const next = uniqueDatesArray[dateIndex + 1];
		return { results, prev, next };
	};

	getFirstDayOfYear = async () => {
		const result = await this.prismaClient
			.$queryRaw`SELECT DISTINCT ON (year) date, year FROM (SELECT TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') as date, SUBSTRING(TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD'), 1, 4) as year FROM tweets ORDER BY date) AS a ORDER BY year;`;

		return result;
	};

	getByKeyword = async (keyword) => {
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

		return results;
	};
}

export default new TweetService(TABLE);
