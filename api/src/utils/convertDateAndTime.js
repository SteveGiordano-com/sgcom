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
        let convertedHour = hour - 3;

        if (convertedHour <= 0) {
            
            const hourMap = {
                "-3": 9,
                "-2": 10,
                "-1": 11,
                "0": 12
            };

            convertedHour = hourMap[convertedHour.toString()];

            if (convertedDate !== 12) {
                meridiem = "PM";
            }
        } else if (convertedHour >= 12) {
            if (convertedHour !== 12) {
                convertedHour = convertedHour - 12;
            };

            meridiem = "PM";
        }
    
		return `${convertedHour.toString()}${remainingTime}${meridiem}`;
	};

	const convertedTime = isAmOrPm(timeStamp);

	return { convertedDate, convertedTime };
};

export default convertDateAndTime;