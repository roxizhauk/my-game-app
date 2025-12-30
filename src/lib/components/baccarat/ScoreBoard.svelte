<script lang="ts">
	import type { Score } from './game.svelte';

	function countScore(score: Score) {
		let pCount = 0;
		let bCount = 0;
		let dCount = 0;
		score.forEach((col) => {
			col.forEach((winner) => {
				switch (winner) {
					case 'PLAYER':
						pCount++;
						break;

					case 'BANKER':
						bCount++;
						break;

					case 'DRAW':
					default:
						dCount++;
						break;
				}
			});
		});
		const gameCount = pCount + bCount + dCount;
		return { pCount, bCount, dCount, gameCount };
	}

	const { score, deckCount }: { score: Score; deckCount: number } = $props();
	const { pCount, bCount, dCount, gameCount } = $derived.by(() => countScore(score));
</script>

<div
	class="flex w-full flex-col divide-y-2 divide-theme-base rounded border-2 border-theme-base font-mono text-xs sm:text-base"
>
	<div class="flex w-full divide-x-2 divide-theme-base text-center text-xs sm:text-sm">
		<div class="flex w-1/5 items-center justify-center p-1 sm:min-h-8">Deck</div>
		<div class="flex w-1/5 items-center justify-center p-1 sm:min-h-8">Game Count</div>
		<div class="flex w-1/5 items-center justify-center p-1 sm:min-h-8">Player Wins</div>
		<div class="flex w-1/5 items-center justify-center p-1 sm:min-h-8">Banker Wins</div>
		<div class="flex w-1/5 items-center justify-center p-1 sm:min-h-8">Draw Count</div>
	</div>
	<div class="flex w-full divide-x-2 divide-theme-base">
		<div class="flex h-6 w-1/5 items-center justify-center sm:h-8">{deckCount}</div>
		<div class="flex h-6 w-1/5 items-center justify-center sm:h-8">{gameCount}</div>
		<div class="flex h-6 w-1/5 items-center justify-center sm:h-8">{pCount}</div>
		<div class="flex h-6 w-1/5 items-center justify-center sm:h-8">{bCount}</div>
		<div class="flex h-6 w-1/5 items-center justify-center sm:h-8">{dCount}</div>
	</div>
	{#if score.length > 0}
		<div
			class="flex w-full max-w-full divide-x-2 divide-theme-base overflow-x-scroll overflow-y-clip"
		>
			{#each score as col, index}
				<div class="flex flex-col divide-y-2 divide-theme-base">
					<div class="flex h-6 w-6 items-center justify-center sm:h-8 sm:w-8">
						{index + 1}
					</div>
					{#each col as row}
						<div
							class={[
								'flex h-6 w-6 items-center justify-center font-bold sm:h-8 sm:w-8',
								{
									'text-theme-sky': row === 'PLAYER',
									'text-theme-red': row === 'BANKER'
									// 'text-green-500': row === 'DRAW'
								}
							]}
						>
							{row === 'DRAW' ? '/' : 'X'}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>
