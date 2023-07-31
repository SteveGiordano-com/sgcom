import schedule from "node-schedule";
import tweetScraper from "./jobs/tweet-scraper.js";

const job = () => {
	schedule.scheduleJob("13 22 * * *", () => {
		tweetScraper();
	});
};

job();
