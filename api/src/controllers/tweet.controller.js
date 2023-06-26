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
			const { results, friendlyDate, prev, next } =
				await this.service.getByDate(date);
			if (results.length) {
				return res
					.json({
						"ok": true,
						"data": {
							"tweets": results,
							"friendlyDate": friendlyDate,
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
			const results = await this.service.getById(id);
			if (results) {
				return res
					.json({
						"ok": true,
						"data": {
							"id": results.id,
							"text": results.text,
							"createdAt": results.created_at,
							"previousTweet": results.prev ? results.prev : null,
							"nextTweet": results.next ? results.next : null,
							"tweetNumber": results.tweetIndex + 1,
							"createDate": results.convertedDate,
							"createTime": results.convertedTime
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
