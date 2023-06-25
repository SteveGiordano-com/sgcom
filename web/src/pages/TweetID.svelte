<script>
	import { onMount } from "svelte";
	import checkParam from "../utils/check-param.js";

	export let id;

	let tweetNumber = 0;

	const getTweet = async (id) => {
		const data = await fetch("/tweets/id/" + id, {
			"method": "GET"
		});

		let responseObj = {};

		if (data.status !== 200) {
			let errMsg = "";
			if (data.status === 204) {
				errMsg = "No tweet found with this ID.";
			} else {
				errMsg = "Something went wrong; please try again later.";
			}
			throw new Error(errMsg);
		} else {
			const response = await data.json();
			console.log(response);
			responseObj = response.data;
			tweetNumber = responseObj.tweetNumber;
		}

		return responseObj;
	};

	onMount(async () => {
		const redirect = !(await checkParam(id, "id"));

		if (redirect) {
			return (window.location.href = "/");
		}
	});

	let promise = getTweet(id);
</script>

<div class="main">
	{#if tweetNumber}
		<h1>Tweet #{tweetNumber}</h1>
	{/if}

	<div id="tweet-block">
		{#await promise}
			<!---->
		{:then data}
			<p>{data.tweet.text}</p>
			{#if data.previousTweet}
				<p><a href="/tweet/{data.previousTweet}">Previous</a></p>
			{/if}
			{#if data.nextTweet}
				<p><a href="/tweet/{data.nextTweet}">Next</a></p>
			{/if}
			<p>Go to full day: <a href="/date/{data.convertedDate}">{data.convertedDate}</a></p>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
</div>
