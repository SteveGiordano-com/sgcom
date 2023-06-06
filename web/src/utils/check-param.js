import { tweetSchema } from "../../../schemas/tweet.schema.js";

const checkParam = async (param, type) => {
	try {
		tweetSchema.parse({
			[type]: param
		});

		return true;
	} catch (err) {
		return false;
	}
};

export default checkParam;
