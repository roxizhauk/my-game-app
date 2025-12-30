<script lang="ts">
	import type { SudokuNum } from './game.svelte';

	interface Props {
		count: number[];
		onClick: (num: SudokuNum) => void;
	}

	let { count, onClick }: Props = $props();
	const nums: SudokuNum[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<div class="grid grid-cols-3 gap-2">
	{#each nums as num, i}
		<button
			disabled={count[i] >= 9}
			class={[
				'h-11 w-12 rounded bg-theme-light p-2 text-2xl font-bold',
				count[i] >= 9 ? 'flex items-center justify-center' : 'btnx btnx-transition focus-none'
			]}
			onclick={() => onClick(num)}
		>
			{num}
		</button>
	{/each}
</div>
