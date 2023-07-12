import schedule from "node-schedule";

schedule.scheduleJob("* * * * *", () => {
    console.log("Clock 1");
});