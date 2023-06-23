<script>
	import Button from "../components/Button.svelte";
	const primaryColor = "#57A872";
	const secondaryColor = "#5764A8";

	let keyword = "";
	let errMsg = "";
	let results = [];
	let noTweetsFound = false;

	const searchTweets = async (searchKeyword) => {
		noTweetsFound = false;

		if (!keyword) {
			return (errMsg = "Please enter a keyword.");
		}

		const response = await fetch("/tweets/search?keyword=" + searchKeyword, {
			"method": "GET"
		});

		if (response.status === 200) {
			const data = await response.json();
			results = data.data;
		} else if (response.status === 204) {
			noTweetsFound = true;
		}

		document.querySelector("#tweet-search").value = "";
		keyword = "";
	};

	const clearResults = () => {
		results = [];
	};

	document.addEventListener("keydown", (event) => {
		noTweetsFound = false;
		errMsg = "";
		if (event.key.toLowerCase() === "enter" && keyword) {
			clearResults();
			const changeColor = (selector, color) => {
				document.querySelector(selector).style.backgroundColor = color;
				document.querySelector(selector).style.borderColor = color;
			};

			changeColor("#search-button", primaryColor);

			setTimeout(() => {
				changeColor("#search-button", secondaryColor);
			}, 300);

			searchTweets(keyword);
		}
	});
</script>

<div class="main">
	<h1>Search Page</h1>

	{#if errMsg}
		{errMsg}
	{/if}

	<div id="search">
		<input bind:value={keyword} type="text" id="tweet-search" />
		<Button
			text="Search"
			id="search-button"
			on:buttonAction={() => searchTweets(keyword)} />
	</div>

	{#if results.length}
		<div id="search-results">
			<h4>Total: {results.length}</h4>
			{#each results as result}
				<p><a href="/tweet/{result.id}">{result.text}</a></p>
			{/each}
			<Button
				text="Clear"
				id="clear-button"
				on:buttonAction={() => clearResults()} />
		</div>
	{:else if noTweetsFound}
		<h4>No tweets found. So steamed.</h4>
	{/if}
</div>

<style>
	#tweet-search {
		color: #000000;
	}
</style>
