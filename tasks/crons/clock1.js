import schedule from "node-schedule";
import main from "../test.js";

schedule.scheduleJob("* * * * *", () => {
	main();
});
