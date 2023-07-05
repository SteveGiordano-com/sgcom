<script>
	import { loggedIn, userEmail, userId } from "../stores";
	import Button from "../components/Button.svelte";

	const login = async () => {
		window.location.href = "/users/login";
	};

	const logout = async () => {
		await fetch("/users/logout", {
			"method": "POST"
		});

		window.location.href = "/";
	}

</script>

<div class="main">
	<h1>Account Page</h1>
	
	<div id="auth-block">
	{#if $loggedIn}
		<h4>You are logged in as {$userEmail}</h4>
		<Button
		text="Logout"
		id="logout-buttion"
		on:buttonAction={() => logout()}
		/>
	{:else}
		<Button
		text="Login"
		id="login-buttion"
		on:buttonAction={() => login()}
	/>
	{/if}
	</div>
</div>

<style>
</style>
