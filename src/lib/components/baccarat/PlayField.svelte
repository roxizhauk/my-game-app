<script lang="ts">
	import CardImage from '$lib/components/card';
	import { cn } from '$lib/utils';
	import type { Card, PlayerResult } from './game.svelte';

	type Props = {
		name: 'Player' | 'Banker';
		hand: Card[];
		total: number;
		result: PlayerResult;
	};

	const { name, hand, total, result }: Props = $props();
</script>

<div
	aria-label="Play Field"
	class="flex w-full flex-col divide-y-2 divide-theme-base rounded border-2 border-theme-base"
>
	<div
		aria-label="Play Role"
		class={cn([
			'flex h-10 w-full items-center justify-center font-mono font-bold',
			{
				'text-theme-red': name == 'Banker',
				'text-theme-sky': name == 'Player'
			}
		])}
	>
		{name}
	</div>
	<div
		aria-label="Card Table"
		class="flex w-full gap-x-1 bg-theme-base p-1 shadow-inner sm:gap-x-2 sm:p-2"
	>
		<CardImage card={hand[0]} />
		<CardImage card={hand[1]} />
		<CardImage card={hand.length > 2 ? hand[2] : undefined} />
	</div>
	<div
		aria-label="Result"
		class="flex h-10 w-full divide-x-2 divide-theme-base font-mono font-bold"
	>
		<div class="flex w-1/2 items-center justify-center">{total}</div>
		<div
			class={[
				'flex w-1/2 items-center justify-center',
				{
					'text-theme-green': result == 'WIN',
					'text-theme-red': result == 'LOSE'
				}
			]}
		>
			{result}
		</div>
	</div>
</div>
