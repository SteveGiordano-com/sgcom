<script>
	export let errMsg;
	export let pageType;

	import Button from "../components/Button.svelte";

	const goBack = () => {
		window.history.back();
	};
</script>

<div id="back-button">
	<h3>{errMsg}</h3>
	<Button
		id="{pageType}-back-button"
		text="Go Back"
		on:buttonAction={() => goBack()} />
</div>

<style>
</style>
