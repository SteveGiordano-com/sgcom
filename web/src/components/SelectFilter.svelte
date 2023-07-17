<script>
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
    }

    const promise = getYears();

</script>

<div id="select-filter">
    <p>Quick Select:</p>
    {#await promise}
        <progress/>
    {:then data}
        {#each data.data as years}
            <input bind:group={selectedYear} type="radio" id="{years.year}" name="year-selector" value="{years.year}">
            <label for="{years.year}" name="year-selector">{years.year}</label>
        {/each}
    {/await}
</div>

<style>

</style>