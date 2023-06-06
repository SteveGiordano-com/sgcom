<script>
	import { createEventDispatcher } from "svelte";

	export let id;
	export let text;

	const dispatch = createEventDispatcher();
	const buttonAction = () => {
		dispatch("buttonAction");
	};
</script>

<div class="submit-button">
	<button on:click={() => buttonAction()} {id}>{text}</button>
</div>
