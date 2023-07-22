const updateDate = async (id, date) => {
	console.log("Updating user");
	const body = JSON.stringify({
		"lastDateViewed": date
	});

	const response = await fetch(`/users/id/${id}`, {
		"method": "PATCH",
		"body": body,
		"headers": {
			"Content-type": "application/json"
		}
	});

	const data = await response.json();
	return data;
};

export default updateDate;
