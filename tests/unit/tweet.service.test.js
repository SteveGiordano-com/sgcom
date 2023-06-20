import { expect } from "chai";
import tweetService from "../../api/src/services/tweet.service.js";

describe("TweetService", () => {
	describe("getAll", () => {
		it("should return all tweets", async () => {
			const response = await tweetService.getAll();
			expect(response.length).to.be.above(0);
		});
	});

	describe("getById", () => {
		it("should return one tweet", async () => {
			const goodId = "1000110999066755072";
			const response = await tweetService.getById(goodId);
			expect(goodId).to.equal(response.results.id);
		});

		it("should return no tweets", async () => {
			const badId = "000";
			const response = await tweetService.getById(badId);
			expect(response.results).to.be.null;
		});
	});

	describe("getUniqueDates", () => {
		it("should return all unique dates", async () => {
			let uniques = [];
			const response = await tweetService.getUniqueDates();
			response.forEach((date) => {
				if (!uniques.includes(date)) {
					uniques.push(date);
				}
			});

			expect(response.length).to.equal(uniques.length);
		});
	});

	describe("getByDate", () => {
		it("should return at least one tweet", async () => {
			const goodDate = "2011-04-01";
			const response = await tweetService.getByDate(goodDate);
			expect(response.results.length).to.be.above(0);
		});

		it("should return no tweets", async () => {
			const badDate = "1987-08-01";
			const response = await tweetService.getByDate(badDate);
			expect(response.results.length).to.equal(0);
		});
	});

	describe("getFirstDayOfYear", () => {
		it("should return all tweets", async () => {
			let uniques = [];
			const response = await tweetService.getFirstDayOfYear();
			response.forEach((dates) => {
				if (!uniques.includes(dates.year)) {
					uniques.push(dates.year);
				}
			});

			expect(response.length).to.equal(uniques.length);
		});
	});

	describe("getByKeyword", () => {
		it("should return at least one tweet", async () => {
			const response = await tweetService.getByKeyword("guys");
			expect(response.length).to.be.above(0);
		});

		it("should return no tweets", async () => {
			const response = await tweetService.getByKeyword("steve giordano");
			expect(response.length).to.equal(0);
		});
	});
});
