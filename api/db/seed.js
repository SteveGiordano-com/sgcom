import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const main = async () => {
	await prisma.tweets.deleteMany({});

	const tweetOne = await prisma.tweets.upsert({
		"where": { "id": "886339339864621056" },
		"update": {},
		"create": {
			"id": "886339339864621056",
			"text": "Told neighbor, I gotta dirty 30 here that needs to get in the fridge pronto, so your problems aren't really a priority for me right now.",
			"created_at": "2017-07-15T21:39:00.000Z"
		}
	});
	const tweetTwo = await prisma.tweets.upsert({
		"where": { "id": "678034991293464576" },
		"update": {},
		"create": {
			"id": "678034991293464576",
			"text": "Gettin' real bombed, then goin' back to the movie theater with Dave's boombox. Let the babes know it's bad boy season.",
			"created_at": "2015-12-19T02:11:53.000Z"
		}
	});
	const tweetThree = await prisma.tweets.upsert({
		"where": { "id": "749039560949129216" },
		"update": {},
		"create": {
			"id": "749039560949129216",
			"text": "Bleary eyes, full cold ones, can't lose.",
			"created_at": "2016-07-02T00:38:42.000Z"
		}
	});
	
	console.log({
		tweetOne,
		tweetTwo,
		tweetThree
	});
};

try {
	main();
} catch (err) {
	console.log(err);
	process.exit(1);
} finally {
	prisma.$disconnect();
}
