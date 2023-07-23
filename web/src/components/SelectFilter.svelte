<script>
	import range from "just-range";

	export let selectedYear = "";

	const getYears = async () => {
		try {
			const response = await fetch("/tweets/dates/first", {
				"method": "GET"
			});

			const data = await response.json();

			return data;
		} catch (err) {
			console.log(err);
		}
	};

	const promise = getYears();
</script>

<div id="select-filter">
	<p>Quick Select:</p>
	{#await promise}
		<progress />
	{:then data}
		<table>
			{#each range(0, data.data.length, 4) as numOne}
				<tr>
					{#each data.data.slice(numOne, numOne + 4) as years, numTwo}
						<td>
							<div class="year-block">
								<input
									bind:group={selectedYear}
									type="radio"
									id={data.data[numOne + numTwo].year}
									name="year-selector"
									value={data.data[numOne + numTwo].year} />
								<label
									for={data.data[numOne + numTwo].year}
									name="year-selector">{data.data[numOne + numTwo].year}</label>
							</div>
						</td>
					{/each}
				</tr>
			{/each}
		</table>
	{/await}
</div>

<style>
	.year-block {
		padding-bottom: 10px;
	}

	label {
		margin-right: 10px;
	}
</style>
