<script>
	export let startDate;
	export let endDate;

	import { tweetDates } from "../stores";
	import Button from "./Button.svelte";

	let errMsg = "";

    const primaryColor = "#57A872";
	const secondaryColor = "#5764A8";

	const convertAndCompareDates = (inputStartDate, inputEndDate) => {
		if (new Date(inputEndDate).getTime() < new Date(inputStartDate).getTime()) {
			errMsg = "End date cannot be before the start date.";
			return false;
		}

		errMsg = "";
		return true;
	};

	const submitDates = async (inputStartDate, inputEndDate) => {
		const isValidRange = convertAndCompareDates(inputStartDate, inputEndDate);

		if (isValidRange) {
			const response = await fetch(
				`/tweets/dates/between/${startDate}/${endDate}`
			);
			const data = await response.json();

            if (data.data.length === 0) {
                return errMsg = "No tweets found within this date range.";
            }

			tweetDates.set(data.data);
		}
	};

    document.addEventListener("keydown", (event) => {
		errMsg = "";
		if (event.key.toLowerCase() === "enter") {
			const changeColor = (selector, color) => {
				document.querySelector(selector).style.backgroundColor = color;
				document.querySelector(selector).style.borderColor = color;
			};

			changeColor("#date-button", primaryColor);

			setTimeout(() => {
				changeColor("#date-button", secondaryColor);
			}, 300);

			submitDates(startDate, endDate);
		}
	});

</script>

{#if errMsg}
	<div id="date-err">
		{errMsg}
	</div>
{/if}

<div id="date-filter">
	<div class="container">
		<input
			bind:value={startDate}
			class="date-input"
			id="start-date"
			type="date" />
		<span id="from-text" class="date-text">@12:00:00AM to</span>
		<input bind:value={endDate} class="date-input" id="start-end" type="date" />
		<span id="to-text" class="date-text">@11:59:59PM</span>
	</div>

	<Button
		id="date-button"
		text="Filter"
		on:buttonAction={() => submitDates(startDate, endDate)} />
</div>

<style>
	.date-input {
		color: black;
	}

	#date-err {
		padding-bottom: 10px;
		color: #f96743;
		font-weight: bold;
	}
</style>
