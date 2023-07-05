<script>
	import { onMount } from "svelte";
	import checkParam from "../utils/check-param.js";

	export let date;

	let friendlyDate = "";

	const getTweet = async (date) => {
		const data = await fetch("/tweets/date/" + date, {
			"method": "GET"
		});

		let responseObj = {};

		if (data.status !== 200) {
			let errMsg = "";
			if (data.status === 204) {
				errMsg = "No tweet found with this date.";
			} else {
				errMsg = "Something went wrong; please try again later.";
			}
			throw new Error(errMsg);
		} else {
			const response = await data.json();
			responseObj = response.data;
			friendlyDate = responseObj.friendlyDate;
		}

		return responseObj;
	};

	onMount(async () => {
		const redirect = !(await checkParam(date, "date"));

		if (redirect) {
			return (window.location.href = "/");
		}

		localStorage.setItem("lastDate", date);
	});

	let promise = getTweet(date);
</script>

<div class="main">
	<h1>Tweets for {friendlyDate}</h1>

	<div id="tweets-block">
		{#await promise}
			<progress />
		{:then data}
			<ul>
				{#each data.tweets as tweet, i}
					<li>
						{tweet.text} (<a href="/tweet/{tweet.id}">{tweet.createTime}</a>)
					</li>
				{/each}
			</ul>
			{#if data.previousDate}
				<p>
					<a href="/date/{data.previousDate}">Previous ({data.previousDate})</a>
				</p>
			{/if}
			{#if data.nextDate}
				<p><a href="/date/{data.nextDate}">Next ({data.nextDate})</a></p>
			{/if}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
</div>

<style>
	li {
		margin-bottom: 10px;
	}
</style>
