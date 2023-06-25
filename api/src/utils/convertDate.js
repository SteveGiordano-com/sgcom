import { Temporal } from "@js-temporal/polyfill";

const convertDate = (datetime) => {
    const timeZone = Temporal.TimeZone.from("America/Detroit");
    const converted = timeZone.getPlainDateTimeFor(datetime);
    return converted.toString().slice(0, 10);
};

export default convertDate;
