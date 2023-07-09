<script>
	import { lastDateViewed, tweetDates } from "../stores";
	import DateFilter from "../components/DateFilter.svelte";

	let errMsg = "";
	let startDate = "";
	let endDate = "";

	$: hasError = !!errMsg;

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

		return responseObj;
	};

	tweetDates.set(getTweetDates());
</script>

<h1>Home</h1>

<DateFilter {startDate} {endDate} />

<div class="main">
	{#if $lastDateViewed && !hasError}
		<div id="last-date">
			<h3>Continue:</h3>
			<p><a href="/date/{$lastDateViewed}">{$lastDateViewed}</a></p>
		</div>
	{/if}

	<div id="tweet-dates">
		{#await $tweetDates}
			<progress />
		{:then data}
			<h3>Tweet Dates:</h3>
			{#each data as item, i}
				<p><a href="/date/{item.date}">{item.date}</a></p>
			{/each}
		{:catch error}
			<p>{errMsg}</p>
		{/await}
	</div>
</div>

<style>
</style>
