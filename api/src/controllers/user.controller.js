import ControllerTemplate from "./_template.js";
import userService from "../services/user.service.js";
import tweetService from "../services/tweet.service.js";
import passport from "passport";

class UserController extends ControllerTemplate {
	service = userService;
	constructor(service) {
		super(service);
	}

	getById = async (req, res) => {
		try {
			const id = req.params.id;
			const results = await this.service.getById(id);

			if (results) {
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
			console.log("getById finished.");
		}
	};

	logout = (req, res, next) => {
		req.logout((err) => {
			if (err) {
				return next(err);
			}
		});

		res.redirect("/");
	};

	checkLogin = async (req, res) => {
		let lastDateViewed = null;

		if (req?.user?.id) {
			const results = await this.service.getById(req.user.id);
			lastDateViewed = results.last_date_viewed;
		}

		return res
			.json({
				"ok": true,
				"loggedIn": !!req.user,
				"data": {
					"email": req.user ? req.user.email : null,
					"id": req.user ? req.user.id : null,
					"lastDateViewed": lastDateViewed
				}
			})
			.status(200);
	};

	updateUser = async (req, res) => {
		try {
			const data = req.body;
			const id = req.params.id;

			if (!data || !Object.keys(data).length) {
				return res
					.json({
						"ok": false,
						"error": "Body object cannot be empty."
					})
					.status(400);
			}

			const acceptableFields = ["lastDateViewed"];
			const invalidFields = [];

			for (let field in data) {
				if (!acceptableFields.includes(field)) {
					invalidFields.push(field);
				}
			}

			if (invalidFields.length) {
				return res
					.json({
						"ok": false,
						"error": `Invalid fields: ${invalidFields}.`
					})
					.status(400);
			}


			if (data.lastDateViewed) {
				const uniqueDatesAll = await tweetService.getUniqueDates();
				const uniqueDates = uniqueDatesAll.results;
				const uniqueDatesArray = uniqueDates.map((dates) => dates.date);

				if (!uniqueDatesArray.includes(data.lastDateViewed)) {
					return res
						.json({
							"ok": false,
							"error": `Invalid date: ${data.lastDateViewed}.`
						})
						.status(400);
				}
			}

			const results = await this.service.updateUser(id, data);

			return res.json({
				"ok": results
			});
		} catch (err) {
			return res
				.json({
					"ok": false,
					"error": err.message
				})
				.status(500);
		} finally {
			console.log("updateUser finished.");
		}
	};

	authenticate = passport.authenticate("google", {
		"scope": ["email", "profile"],
		"prompt": "select_account"
	});

	redirect = passport.authenticate("google", {
		"successRedirect": "/account",
		"failureRedirect": "/"
	});
}

export default new UserController(userService);
