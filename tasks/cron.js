import schedule from "node-schedule";
import tweetScraper from "./jobs/tweet-scraper.js";

const job = () => {
	schedule.scheduleJob("22 22 * * *", () => {
		tweetScraper();
	});
};

job();
