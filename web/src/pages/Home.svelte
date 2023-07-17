<script>
	import { lastDateViewed, tweetDates } from "../stores";
	import DateFilter from "../components/DateFilter.svelte";

	let errMsg = "";

	$: hasError = !!errMsg;
</script>

<h1>Home</h1>

<DateFilter />

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
