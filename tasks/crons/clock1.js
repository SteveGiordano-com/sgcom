import schedule from "node-schedule";
import worker from "../test.js";

schedule.scheduleJob("* * * * *", () => {
	worker.main();
});
