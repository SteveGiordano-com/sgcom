import { writable } from "svelte/store";
export const totalTweets = writable(0);
export const loggedIn = writable(false);
export const userId = writable("");
export const userEmail= writable("");