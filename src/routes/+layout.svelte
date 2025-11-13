<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>My Game App</title>
</svelte:head>

<main>
	{@render children?.()}
</main>
