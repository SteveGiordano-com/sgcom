import { expect } from "chai";
import tweetService from "../../api/src/services/tweet.service.js";

describe("TweetService", () => {
	describe("getAll", () => {
		it("should return all tweets", async () => {
			const results = await tweetService.getAll();
			expect(results.length).to.be.above(0);
		});
	});

	describe("getById", () => {
		it("should return one tweet", async () => {
			const goodId = "1000110999066755072";
			const results = await tweetService.getById(goodId);
			expect(goodId).to.equal(results.result.id);
		});

		it("should return no tweets", async () => {
			const badId = "000";
			const results = await tweetService.getById(badId);
			expect(results.result).to.be.null;
		});
	});

	describe("getUniqueDates", () => {
		it("should return all unique dates", async () => {
			let uniques = [];
			const results = await tweetService.getUniqueDates();
			results.forEach((date) => {
				if (!uniques.includes(date)) {
					uniques.push(date);
				}
			});

			expect(results.length).to.equal(uniques.length);
		});
	});

	describe("getByDate", () => {
		it("should return at least one tweet", async () => {
			const goodDate = "2011-04-01";
			const results = await tweetService.getByDate(goodDate);
			expect(results.results.length).to.be.above(0);
		});

		it("should return no tweets", async () => {
			const badDate = "1987-08-01";
			const results = await tweetService.getByDate(badDate);
			expect(results.results.length).to.equal(0);
		});
	});

	describe("getFirstDayOfYear", () => {
		it("should return all tweets", async () => {
			let uniques = [];
			const results = await tweetService.getFirstDayOfYear();
			results.forEach((dates) => {
				if (!uniques.includes(dates.year)) {
					uniques.push(dates.year);
				}
			});

			expect(results.length).to.equal(uniques.length);
		});
	});

	describe("getByKeyword", () => {
		it("should return at least one tweet", async () => {
			const results = await tweetService.getByKeyword("guys");
			expect(results.length).to.be.above(0);
		});

		it("should return no tweets", async () => {
			const results = await tweetService.getByKeyword("steve giordano");
			expect(results.length).to.equal(0);
		});
	});
});
