<script lang="ts">
	import { cn } from '$lib/cn';
	import type { Snippet } from 'svelte';

	let { children, row, col }: { children: Snippet; row: number; col: number } = $props();
</script>

<div
	class={cn([
		'h-8 w-8 border border-theme-dark font-bold sm:h-12 sm:w-12 sm:text-2xl',
		{
			'border-b-3': (row + 1) % 3 === 0 && row !== 8,
			'border-t-3': row == 3 || row == 6,
			'border-r-3': (col + 1) % 3 === 0 && col !== 8,
			'border-l-3': col == 3 || col == 6
		}
	])}
>
	{@render children?.()}
</div>
