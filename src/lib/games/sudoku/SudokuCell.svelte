<script lang="ts">
	import { cn } from '$lib/cn';
	import type { SudokuNum } from './game.svelte';
	let {
		value,
		active,
		onclick
	}: {
		value: SudokuNum | 0;
		active: boolean;
		onclick: () => void;
	} = $props();
</script>

<div
	role="gridcell"
	tabindex="-1"
	{onclick}
	onkeydown={() => {}}
	class={cn(['h-full w-full px-2.5 py-1 text-center focus-none', { 'bg-theme-sky-light': active }])}
>
	{value || ''}
</div>
