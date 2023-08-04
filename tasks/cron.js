import schedule from "node-schedule";
import tweetScraper from "./jobs/tweet-scraper.js";

const job = () => {
	schedule.scheduleJob("27 18 * * *", () => {
		tweetScraper();
	});
};

job();
