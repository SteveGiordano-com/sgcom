import schedule from "node-schedule";
import main from "../test.js";

const job = () => {
	schedule.scheduleJob("* * * * *", () => {
		main();
	});
};

job();
