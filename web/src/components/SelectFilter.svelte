<script>
	import range from "just-range";

	export let selectedYear = "";

	const getYears = async () => {
		try {
			const response = await fetch("/tweets/dates/first", {
				"method": "GET"
			});

			const data = await response.json();
			console.log(data.data);

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
			{#each range(0, data.data.length, 4) as i}
				<tr>
					{#each data.data.slice(i, i + 4) as years, num}
						<td>
							<div class="year-block">
								<input
									bind:group={selectedYear}
									type="radio"
									id={data.data[num]}
									name="year-selector"
									value={data.data[num]} />
								<label for={data.data[num]} name="year-selector"
									>{data.data[num].year}</label>
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
