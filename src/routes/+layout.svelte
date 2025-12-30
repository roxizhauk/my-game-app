<script lang="ts">
	import { page } from '$app/state';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import { initSettings } from '$lib/settings.svelte';
	import { ArrowLeftFromLine } from '@lucide/svelte';
	import { onMount, type Snippet } from 'svelte';
	import './layout.css';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	onMount(initSettings);
</script>

<svelte:head>
	<title>My Game App</title>
</svelte:head>

<div class="pointer-events-none fixed inset-x-0 top-0 z-50 w-full">
	<div class="relative mx-auto sm:max-w-2xl">
		{#if page.url.pathname !== '/'}
			<a
				href="/"
				class="pointer-events-auto absolute top-2 left-2 cursor-pointer focus-none focus:rounded-sm focus:ring-2 focus:ring-blue-300"
			>
				<ArrowLeftFromLine class="size-6" />
			</a>
		{/if}
		<Dropdown />
	</div>
</div>

{@render children()}
