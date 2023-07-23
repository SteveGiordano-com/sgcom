<script>
	import { onMount } from "svelte";
	import { lastDateViewed } from "../stores.js";
	import checkParam from "../utils/check-param.js";
	import updateDate from "../utils/update-date.js";
	import checkLogin from "../utils/check-login.js";

	import GoBack from "../components/GoBack.svelte";
	import Card from "../components/Card.svelte";

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

			localStorage.setItem("lastDateViewed", date);
			lastDateViewed.set(date);

			const loginData = await checkLogin();
			const userId = loginData.data.id;

			console.log(loginData);
			if (userId) {
				updateDate(userId, date);
			}
		}

		return responseObj;
	};

	onMount(async () => {
		const redirect = !(await checkParam(date, "date"));

		if (redirect) {
			return (window.location.href = "/");
		}
	});

	let promise = getTweet(date);
</script>

<div class="main">
	{#if friendlyDate}
		<h1>Tweets for {friendlyDate}</h1>
	{/if}

	<div id="tweets-block">
		{#await promise}
			<progress />
		{:then data}
			{#each data.tweets as tweet, i}
				<Card
					id={tweet.id}
					text={tweet.text}
					createDate={null}
					createTime={tweet.createTime} />
			{/each}
			{#if data.previousDate}
				<p>
					<a href="/date/{data.previousDate}">Previous ({data.previousDate})</a>
				</p>
			{/if}
			{#if data.nextDate}
				<p><a href="/date/{data.nextDate}">Next ({data.nextDate})</a></p>
			{/if}
		{:catch error}
			<GoBack errMsg={error.message} pageType="tweet-date" />
		{/await}
	</div>
</div>

<style>
</style>
