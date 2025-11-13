<script lang="ts">
	import { cn } from '$lib/cn';
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
			'bg-theme-dark text-theme-white': status === 0,
			'bg-theme-base': status === 2 || status === 1
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
