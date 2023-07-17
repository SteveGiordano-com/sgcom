<script>
	import { tweetDates } from "../stores";
	import Button from "./Button.svelte";
	import SelectFilter from "./SelectFilter.svelte";

	let errMsg = "";
	let providedYear = "";
	let startDate;
	let endDate;
	let isFiltered = false;

	$: {
		startDate = `${providedYear}-01-01`;
		endDate = `${providedYear}-12-31`;
	}

	const primaryColor = "#57A872";
	const secondaryColor = "#5764A8";

	const getTweetDates = async () => {
		const response = await fetch("/tweets/dates", {
			"method": "GET"
		});

		let responseObj;

		if (response.status !== 200) {
			errMsg = "Server error. Please try again later.";
			throw new Error(errMsg);
		} else {
			const data = await response.json();

			if (!data.ok) {
				errMsg = "Something went wrong.";
				throw new Error(errMsg);
			}

			responseObj = data.data;
		}

		startDate = responseObj.at(0).date;
		endDate = responseObj.at(-1).date;

		tweetDates.set(responseObj);
	};

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
				return (errMsg = "No tweets found within this date range.");
			}

			tweetDates.set(data.data);
		}

		isFiltered = true;
	};

	const resetDates = () => {
		getTweetDates();
		const radioInputs = document.querySelectorAll(
			"input[name='year-selector']"
		);
		for (const input of radioInputs) {
			if (input.checked) {
				input.checked = false;
				break;
			}
		}

		isFiltered = false;
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

	getTweetDates();
</script>

<div id="date-filter">
	{#if errMsg}
		<div id="date-err">
			{errMsg}
		</div>
	{/if}

	<div class="container">
		<input
			bind:value={startDate}
			class="date-input"
			id="start-date"
			type="date" />
		<span id="from-text" class="date-text">@12:00:00AM to</span>
		<input bind:value={endDate} class="date-input" id="end-date" type="date" />
		<span id="to-text" class="date-text">@11:59:59PM</span>

		<SelectFilter bind:selectedYear={providedYear} />
	</div>

	<div class="buttons-container">
		<Button
			id="date-button"
			text="Filter"
			on:buttonAction={() => submitDates(startDate, endDate)} />

		{#if isFiltered}
			<Button
				id="reset-button"
				text="Reset"
				on:buttonAction={() => resetDates()} />
		{/if}
	</div>
</div>

<style>
	.buttons-container {
		display: flex;
	}

	.date-input {
		color: black;
	}

	#date-err {
		padding-bottom: 10px;
		color: #f96743;
		font-weight: bold;
	}
</style>
