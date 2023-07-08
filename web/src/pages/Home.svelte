<script>
	import Error from "./Error.svelte";
	import { lastDateViewed } from "../stores";
	import { totalTweets } from "../stores";

	let errMsg = "";

	$: hasError = !!errMsg;

	const getTweetDates = async () => {
		const data = await fetch("/tweets/dates", {
			"method": "GET"
		});

		let responseObj;

		if (data.status !== 200) {
			errMsg = "Server error. Please try again later.";
			throw new Error(errMsg);
		} else {
			const response = await data.json();

			if (!response.ok) {
				errMsg = "Something went wrong.";
				throw new Error(errMsg);
			}

			responseObj = response.data;

			totalTweets.set(
				responseObj.reduce((acc, item) => acc + item.tweet_count, 0)
			);
		}

		return responseObj;
	};

	let promise = getTweetDates();
</script>

<h1>Home Page</h1>

<div class="main">
	{#if $lastDateViewed && !hasError}
		<div id="last-date">
			<h3>Continue:</h3>
			<p><a href="/date/{$lastDateViewed}">{$lastDateViewed}</a></p>
		</div>
	{/if}

	<div id="tweet-dates">
		{#await promise}
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
