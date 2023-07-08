const checkLogin = async () => {
	const response = await fetch("/users/validate", {
		"method": "POST"
	});

	const data = await response.json();

	return data;
};

export default checkLogin;
