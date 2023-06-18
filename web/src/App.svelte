<script>
	import { Router, Route } from "svelte-routing";
	import About from "./pages/About.svelte";
	import Error from "./pages/Error.svelte";
	import Home from "./pages/Home.svelte";
	import Search from "./pages/Search.svelte";
	import TweetID from "./pages/TweetID.svelte";
	import TweetDate from "./pages/TweetDate.svelte";
	import Nav from "./components/Nav.svelte";
</script>

<Nav />

<Router>
	<Route path="/" component={Home} />
	<Route path="/search" component={Search} />
	<Route path="/about" component={About} />
	<Route path="/date/:date" component={TweetDate} let:params />
	<Route path="/tweet/:id" component={TweetID} let:params />
	<Route path="*" component={Error} />
</Router>
