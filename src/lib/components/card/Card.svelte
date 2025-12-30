<script lang="ts">
	import type { Card } from '$lib/deck';
	import { cn, type ClassValue } from '$lib/utils';
	import SuitIcon from './SuitIcon.svelte';

	interface Props {
		card?: Card;
		className?: ClassValue;
	}

	const { card, className }: Props = $props();

	let isFlipped = $state(false);

	function genValChar(value: number) {
		switch (value) {
			case 13:
				return 'K';
			case 12:
				return 'Q';
			case 11:
				return 'J';
			case 1:
				return 'A';
			default:
				return value;
		}
	}
</script>

<div class={cn(['h-20 w-1/3 sm:h-32', className])}>
	<div class="size-full perspective-distant">
		<div
			class={cn([
				'relative size-full transform-3d',
				{
					'rotate-y-180 transition duration-1000': card
				}
			])}
		>
			<!-- Back Side -->
			<div
				class="absolute inset-0 size-full rounded bg-theme-green drop-shadow backface-hidden"
			></div>

			<!-- Front Side -->
			<div
				class="absolute inset-0 flex size-full rotate-y-180 flex-col justify-between rounded bg-theme-white p-1 drop-shadow backface-hidden sm:p-2"
			>
				{#if card}
					<div
						class={[
							{
								'text-red-400': card.suit === 'heart' || card.suit == 'diamond'
							}
						]}
					>
						<SuitIcon suit={card.suit} />
					</div>
					<div
						class={[
							'flex items-center justify-center text-xl sm:text-4xl',
							{
								'text-theme-red': card.suit === 'heart' || card.suit == 'diamond'
							}
						]}
					>
						{genValChar(card.value)}
					</div>
					<div
						class={[
							'rotate-180',
							{
								'text-red-400': card.suit === 'heart' || card.suit == 'diamond'
							}
						]}
					>
						<SuitIcon suit={card.suit} />
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
