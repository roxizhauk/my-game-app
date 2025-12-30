<script lang="ts">
	import { cn } from '$lib/utils';
	import { Delete } from '@lucide/svelte';
	import type { Status } from './game.svelte';

	type Props = {
		key: string;
		status: Status | undefined;
		handleKeyClick: (key: string) => void;
	};

	let { key, status, handleKeyClick }: Props = $props();
</script>

<button
	onclick={() => handleKeyClick(key)}
	class={cn([
		'btnx h-8 w-full btnx-transition rounded text-xs font-bold focus-none sm:h-11 sm:text-lg',
		{
			'bg-theme-light': status === undefined,
			'bg-theme-midnight text-white': status === 0,
			'bg-theme-yellow': status === 1,
			'bg-theme-green': status === 2
		},
		{
			'text-xs sm:text-sm': key === 'Enter',
			'bg-theme-green text-theme-white': key === 'New'
		}
	])}
>
	{#if key === 'Back'}
		<Delete class="size-5 sm:size-6" />
	{:else}
		{key}
	{/if}
</button>
