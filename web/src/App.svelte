<script>
	import { onMount } from "svelte";
	import { loggedIn, userEmail, userId } from "./stores";
	import { Router, Route } from "svelte-routing";
	import About from "./pages/About.svelte";
	import Error from "./pages/Error.svelte";
	import Home from "./pages/Home.svelte";
	import Search from "./pages/Search.svelte";
	import TweetID from "./pages/TweetID.svelte";
	import TweetDate from "./pages/TweetDate.svelte";
	import Account from "./pages/Account.svelte";
	import FourOhFour from "./pages/FourOhFour.svelte";
	import Nav from "./components/Nav.svelte";

	onMount(async () => {

		const response = await fetch("/users/validate", {
			"method": "POST"
		});

		const data = await response.json();

		loggedIn.set(data.loggedIn);
		
		if (data.loggedIn) {
			userEmail.set(data.data.email);
			userId.set(data.data.id);
		}
	});

</script>

<Nav />

<Router>
	<Route path="/" component={Home} />
	<Route path="/search" component={Search} />
	<Route path="/about" component={About} />
	<Route path="/date/:date" component={TweetDate} let:params />
	<Route path="/tweet/:id" component={TweetID} let:params />
	<Route path="/404" component={FourOhFour} />
	<Route path="/account" component={Account} />
	<Route path="*" component={Error} />
</Router>
