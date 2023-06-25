import ControllerTemplate from "./_template.js";
import tweetService from "../services/tweet.service.js";

class TweetController extends ControllerTemplate {
	service = tweetService;
	constructor(service) {
		super(service);
	}

	getAll = async (req, res) => {
		try {
			const results = await this.service.getAll();
			return res
				.json({
					"ok": true,
					"data": results
				})
				.status(200);
		} catch (err) {
			return res
				.json({
					"ok": false,
					"error": err.message
				})
				.status(500);
		} finally {
			console.log("getAll finished.");
		}
	};

	getFirstDayOfYear = async (req, res) => {
		try {
			const results = await this.service.getFirstDayOfYear();
			return res
				.json({
					"ok": true,
					"data": results
				})
				.status(200);
		} catch (err) {
			return res
				.json({
					"ok": false,
					"error": err.message
				})
				.status(500);
		} finally {
			console.log("getFirstDayOfYear finished.");
		}
	};

	getUniqueDates = async (req, res) => {
		try {
			const results = await this.service.getUniqueDates();

			return res
				.json({
					"ok": true,
					"data": results
				})
				.status(200);
		} catch (err) {
			return res
				.json({
					"ok": false,
					"error": err.message
				})
				.status(500);
		} finally {
			console.log("getUniqueDates finished.");
		}
	};

	getByDate = async (req, res) => {
		try {
			const date = req.params.date;
			const { results, prev, next } = await this.service.getByDate(date);
			if (results.length) {
				return res
					.json({
						"ok": true,
						"data": {
							"tweets": results,
							"previousDate": prev ? prev : null,
							"nextDate": next ? next : null
						}
					})
					.status(200);
			}

			return res.status(204).json();
		} catch (err) {
			return res
				.json({
					"ok": false,
					"error": err.message
				})
				.status(500);
		} finally {
			console.log("getByDate finished.");
		}
	};

	getById = async (req, res) => {
		try {
			const id = req.params.id;
			const { results, prev, next, tweetIndex, convertedDate } = await this.service.getById(
				id
			);
			if (results) {
				return res
					.json({
						"ok": true,
						"data": {
							"tweet": results[0],
							"previousTweet": prev ? prev : null,
							"nextTweet": next ? next : null,
							"tweetNumber": tweetIndex + 1,
							"convertedDate": convertedDate
						}
					})
					.status(200);
			}

			return res.status(204).json();
		} catch (err) {
			return res
				.json({
					"ok": false,
					"error": err.message
				})
				.status(500);
		} finally {
			console.log("getById finished.");
		}
	};

	getByKeyword = async (req, res) => {
		try {
			const keyword = req.query.keyword;

			if (!keyword) {
				throw new Error("No keyword provided");
			}

			const results = await this.service.getByKeyword(keyword);

			if (results.length) {
				return res
					.json({
						"ok": true,
						"data": results
					})
					.status(200);
			}

			return res.status(204).json();
		} catch (err) {
			return res
				.json({
					"ok": false,
					"error": err.message
				})
				.status(500);
		} finally {
			console.log("getByKeyword finished.");
		}
	};
}

export default new TweetController(tweetService);
