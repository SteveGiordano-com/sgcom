import schedule from "node-schedule";
import main from "../test.js";
console.log("Initializing...");
const job = () => {
	schedule.scheduleJob("* * * * *", () => {
		main();
	});
};

job();
