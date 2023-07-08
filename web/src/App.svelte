<script>
	import { onMount } from "svelte";
	import { lastDateViewed, loggedIn, userEmail, userId } from "./stores";
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
	import checkLogin from "./utils/check-login.js";

	onMount(async () => {
		const data = await checkLogin();

		loggedIn.set(data.loggedIn);

		if (data.loggedIn) {
			localStorage.setItem("lastDateViewed", data.data.lastDateViewed);
			userEmail.set(data.data.email);
			lastDateViewed.set(data.data.lastDateViewed);
			userId.set(data.data.id);
		} else if (localStorage.getItem("lastDateViewed")) {
			lastDateViewed.set(localStorage.getItem("lastDateViewed"));
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
