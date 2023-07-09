<script>
	import Button from "../components/Button.svelte";
	import Card from "../components/Card.svelte";

	const primaryColor = "#57A872";
	const secondaryColor = "#5764A8";
	const baseUrl = new URL(window.location.origin + "/search");
	const currentParams = new URLSearchParams(window.location.search);

	let keyword = "";
	let keywordDisplay = "";
	let errMsg = "";
	let results = [];
	let noTweetsFound = false;

	const searchTweets = async (searchKeyword) => {
		noTweetsFound = false;

		if (!searchKeyword.trim()) {
			return (errMsg = "Please enter a keyword.");
		}

		const response = await fetch("/tweets/search?keyword=" + searchKeyword, {
			"method": "GET"
		});

		if (response.status === 200) {
			baseUrl.searchParams.set("term", searchKeyword);
			const data = await response.json();
			results = data.data;
		} else if (response.status === 204) {
			noTweetsFound = true;
			clearResults();
		}

		history.pushState({}, "", baseUrl);
		document.querySelector("#tweet-search").value = "";
		keyword = "";
		keywordDisplay = searchKeyword;
	};

	if (currentParams.get("term")) {
		searchTweets(currentParams.get("term"));
	}

	const clearResults = () => {
		results = [];
		baseUrl.searchParams.delete("term");
		history.pushState({}, "", baseUrl);
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
	<h1>Search</h1>

	<div id="search-input">
		{#if errMsg}
			<p>{errMsg}</p>
		{/if}

		<input bind:value={keyword} type="text" id="tweet-search" />
	</div>

	<div id="buttons-container">
		<Button
			text="Search"
			id="search-button"
			on:buttonAction={() => searchTweets(keyword)} />

		{#if results.length}
			<Button
				text="Clear"
				id="clear-button"
				on:buttonAction={() => clearResults()} />
		{/if}
	</div>

	{#if results.length}
		<div id="search-results">
			<h4>Searching for: {keywordDisplay}</h4>
			<h4>Total: {results.length}</h4>
			{#each results as result}
				<Card
					id={result.id}
					text={result.text}
					createDate={result.createDate}
					createTime={result.createTime}
					isFavorite={false} />
			{/each}
		</div>
	{:else if noTweetsFound}
		<h4>No tweets found. So steamed.</h4>
	{/if}
</div>

<style>
	#buttons-container {
		display: flex;
	}

	#tweet-search {
		color: #000000;
	}
</style>
