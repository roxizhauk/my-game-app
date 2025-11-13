<script lang="ts">
	import AppBar from '$lib/components/AppBar.svelte';
	let { children } = $props();
</script>

<AppBar>
	{@render children()}
</AppBar>
