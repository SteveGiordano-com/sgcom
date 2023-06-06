import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const main = async () => {
	await prisma.tweets.deleteMany({});

	const tweetOne = await prisma.tweets.upsert({
		"where": { "id": "1000110999066755072" },
		"update": {},
		"create": {
			"id": "1000110999066755072",
			"text": "Happy Friday to ya, you guys",
			"created_at": "2011-04-01T06:18:50.000Z"
		}
	});
	const tweetTwo = await prisma.tweets.upsert({
		"where": { "id": "1004799075672252416" },
		"update": {},
		"create": {
			"id": "1004799075672252416",
			"text": "Really lookin' forward to the weekend, you guys.",
			"created_at": "2022-01-30T06:18:50.000Z"
		}
	});
	const tweetThree = await prisma.tweets.upsert({
		"where": { "id": "1004799075672252446" },
		"update": {},
		"create": {
			"id": "1004799075672252446",
			"text": "hey.",
			"created_at": "2022-01-30T07:18:50.000Z"
		}
	});
	const tweetFour = await prisma.tweets.upsert({
		"where": { "id": "1004799075672252414" },
		"update": {},
		"create": {
			"id": "1004799075672252414",
			"text": "Really lookin' forward to the weekend, you guys.",
			"created_at": "2022-02-09T06:18:50.000Z"
		}
	});
	const tweetFive = await prisma.tweets.upsert({
		"where": { "id": "1004799075672242446" },
		"update": {},
		"create": {
			"id": "1004799075672242446",
			"text": "hey 2.",
			"created_at": "2022-01-30T07:28:50.000Z"
		}
	});
	console.log({
		tweetOne,
		tweetTwo,
		tweetThree,
		tweetFour,
		tweetFive
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
