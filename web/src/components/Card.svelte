<script>
	export let id;
	export let text;
	export let createDate;
	export let createTime;
	export let isFavorite;

	let heartAlt = "heart-empty";

	if (isFavorite) {
		heartAlt = "heart-full";
	}
</script>

<div {id} class="card">
	<div class="container">
		<p class="tweet-text">{text}</p>
		<p class="tweet-date">{createDate ? createDate + " @ " : ""}{createTime}</p>
		<img alt={heartAlt} src="/images/heart-empty.png" />
	</div>
</div>

<style>
	.card {
		border: 1px solid white;
		background-color: black;
		transition: 0.1s;
		margin-bottom: 10px;
		width: 80%;
	}

	.container {
		padding-left: 16px;
	}

	.tweet-text {
		font-size: 20px;
		font-weight: bold;
	}

	.tweet-date {
		font-size: 16px;
	}
</style>
