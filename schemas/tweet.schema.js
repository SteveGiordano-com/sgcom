import { z } from "zod";

const schema = z.object({
	"date": z
		.string()
		.regex(/^([0-9]){4}-([0-9]){2}-([0-9]){2}$/)
		.optional(),
	"id": z
		.string()
		.regex(/^([0-9]){11,}$/)
		.optional()
});

export { schema as tweetSchema };
