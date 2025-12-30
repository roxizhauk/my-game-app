<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		isCleared: boolean[];
		scrollTo: (index: number) => void;
	}

	let { isCleared, scrollTo }: Props = $props();
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
