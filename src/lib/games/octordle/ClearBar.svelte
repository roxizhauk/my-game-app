<script lang="ts">
	import { cn } from '$lib/cn';
	let { isCleared }: { isCleared: boolean[] } = $props();

	function scrollTo(index: number) {
		const boardElement = document.getElementById(`w${index}`);
		if (boardElement) {
			boardElement.scrollIntoView({
				behavior: 'smooth', // スムーズなスクロール
				block: 'start' // 要素の上端がビューポートの上端に揃うようにスクロール
			});
		}
	}
</script>

<div class="flex w-full gap-1 select-none">
	{#each isCleared as cleared, index}
		<button
			onclick={() => scrollTo(index)}
			class={cn([
				'btnx w-1/6 rounded text-xs font-bold text-theme-white focus-none sm:h-6 sm:text-base',
				{
					'bg-theme-green': cleared,
					'bg-theme-dark': !cleared
				}
			])}
		>
			{index + 1}
			{cleared ? '✓' : '✗'}
		</button>
	{/each}
</div>
