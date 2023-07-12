import playwright from "playwright";
import { parse } from "node-html-parser";
import { PrismaClient } from "@prisma/client";
import { today, yesterday } from "./utils/dates.js";
import configObj from "../configs/env.config.js";

const { twitterUser, twitterPassword } = configObj;

const prisma = new PrismaClient();

const main = async () => {
	const browserOptions = {
		"headless": false
	};

	const allTweets = [];
	const browser = await playwright.chromium.launch(browserOptions);
	const page = await browser.newPage({
		"bypassCSP": true
	});

	let startNum = 0;
	let finished = false;
	let totalTweets = 0;

	await page.goto("https://twitter.com/login");
	await page.getByRole("textbox").fill(twitterUser);
	await page.keyboard.down("Enter");
	await page.getByLabel("Password", { "exact": true }).fill(twitterPassword);
	await page.keyboard.down("Enter");
	await page.waitForURL("**/home");
	await page.goto("https://twitter.com/dadboner");

	const findTweets = async (num) => {
		const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
		for (let i = num; i < num + 1000; i += 100) {
			window.scrollTo(num, i);
			await delay(100);
		}
	};

	const getTweets = async () => {
		await page.waitForSelector("article[data-testid='tweet']");

		const tweets = await page.$$("article[data-testid='tweet']");
		const allSpansText = await page.locator("span").allTextContents();
		const hasPinnedTweet = allSpansText.includes("Pinned Tweet");

		let total = 0;

		for (const tweet of tweets) {
			total += 1;
			if (total === 1 && hasPinnedTweet) {
				continue;
			}

			const html = await tweet.innerHTML();
			const root = parse(html);
			const tweetDiv = root.querySelector("div[data-testid='tweetText']");

			try {
				const tweetText = tweetDiv.innerText;
				const tweetTime =
					root.querySelector("time[datetime]").rawAttributes.datetime;
				const tweetDate = tweetTime.substring(0, 10);
				const isRetweet = html.includes("Retweeted");
				const tweetUrl =
					root.querySelector("time[datetime]").parentNode.rawAttributes.href;
				const tweetId = tweetUrl.substring(
					tweetUrl.indexOf("/status/") + "/status/".length
				);

				if ((tweetDate === yesterday || tweetDate === today) && !isRetweet) {
					if (!allTweets.some((tweet) => tweet.id === tweetId)) {
						allTweets.push({
							"id": tweetId,
							"text": tweetText,
							"created_at": tweetTime
						});
					}
					console.log("Adding tweet ID", tweetId, tweetDate, tweetText);
				} else if (isRetweet) {
					console.log("Retweet. Continuing to next tweet.");
					continue;
				} else if (tweetDate !== yesterday && tweetDate !== today) {
					console.log("End of today's tweets");
					finished = true;
					break;
				}
			} catch (err) {
				console.log("No text. Continuing.");
				continue;
			}
		}
	};

	while (!finished) {
		await getTweets();
		await page.evaluate(findTweets, startNum);
		startNum += 1000;
	}

	await browser.close();

	for (const tweet of allTweets) {
		try {
			const results = await prisma.$queryRaw`SELECT * FROM tweets WHERE id = ${tweet.id};`;
			if (!results.length) {
				try {
					await prisma.tweets.create({
						"data": {
							"id": tweet.id,
							"text": tweet.text,
							"created_at": tweet.created_at
						}
					});
					totalTweets += 1;
				} catch (err) {
					console.log(err);
				}
			} else {
				console.log(`Tweet ${tweet.id} already exists.`);
			}
		} catch (err) {
			console.log(err);
		}
	}

	console.log(`Total tweets added: ${totalTweets}.`);
};

main();
