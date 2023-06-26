import { Temporal } from "@js-temporal/polyfill";

const convertDateAndTime = (datetime) => {
	const timeZone = Temporal.TimeZone.from("America/Detroit");
	const converted = timeZone.getPlainDateTimeFor(datetime);
	const convertedDate = converted.toString().slice(0, 10);
	const timeStamp = converted.toString().slice(11);

	const isAmOrPm = (timeStamp) => {
		const hour = parseInt(timeStamp.slice(0, 2));
		const remainingTime = timeStamp.slice(2);
		let meridiem = "AM";
		let convertedHour = hour;

		if (hour === 0) {
			convertedHour = 12;
		} else if (hour >= 13) {
			convertedHour = hour - 12;
			meridiem = "PM";
		}

		return `${convertedHour.toString()}${remainingTime}${meridiem}`;
	};

	const convertedTime = isAmOrPm(timeStamp);

	return { convertedDate, convertedTime };
};

export default convertDateAndTime;
