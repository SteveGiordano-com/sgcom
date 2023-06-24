<script>
	import { createEventDispatcher } from "svelte";

	export let id;
	export let text;

	const dispatch = createEventDispatcher();
	const buttonAction = () => {
		dispatch("buttonAction");
	};
</script>

<div class="button">
	<button class="submit-button" on:click={() => buttonAction()} {id}
		>{text.toUpperCase()}</button>
</div>

<style>
	.submit-button {
		color: #fefdff;
		background-color: #5764a8;
		border-color: #5764a8;
		border-radius: 8px;
		font-weight: bold;
		margin-top: 20px;
		margin-right: 5px;
		padding: 0.5em 2em 0.5em 2em;
	}

	.submit-button:hover {
		background-color: #57a872 !important;
		border-color: #57a872 !important;
	}
</style>
