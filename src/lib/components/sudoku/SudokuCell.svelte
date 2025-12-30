<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SudokuNum } from './game.svelte';

	interface Props {
		value: SudokuNum | 0;
		active: boolean;
		onclick: () => void;
	}

	let { value, active, onclick }: Props = $props();
</script>

<div
	role="gridcell"
	tabindex="-1"
	{onclick}
	onkeydown={() => {}}
	class={cn(['size-full px-2.5 py-1 text-center focus-none', { 'bg-theme-sky-light': active }])}
>
	{value || ''}
</div>
