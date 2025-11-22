<script lang="ts">
	import { cn } from '$lib/cn';
	let { isCleared, scrollTo }: { isCleared: boolean[]; scrollTo: (index: number) => void } =
		$props();
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
