import { Temporal } from "@js-temporal/polyfill";

const todayDateISO = Temporal.Now.plainDateISO();
const tomorrow = todayDateISO.add({ "days": 1 });
const tomorrowStr = tomorrow.toString() + "T00:00:00-04:00";
const tomorrowInstant = Temporal.Instant.from(tomorrowStr).epochSeconds;

const todayZoned = Temporal.Now.zonedDateTimeISO();
const todayInstant = Temporal.Instant.from(todayZoned.toString()).epochSeconds;

const expiration = tomorrowInstant - todayInstant;

export default expiration;
