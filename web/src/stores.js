import { writable } from "svelte/store";
export const totalTweets = writable(0);
export const loggedIn = writable(false);
export const userId = writable("");
export const userEmail = writable("");
export const lastDateViewed = writable("");
export const tweetDates = writable([]);
