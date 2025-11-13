<script lang="ts">
	import type { Card } from '$lib/deck';
	import SuitIcon from './SuitIcon.svelte';

	const { card }: { card?: Card } = $props();

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

<div
	class={[
		'relative flex h-20 w-1/3 items-center justify-center rounded p-1 font-mono drop-shadow sm:h-32 sm:p-1.5',
		card ? 'bg-theme-white' : 'bg-theme-light'
	]}
>
	{#if card}
		<div class="flex h-full w-full flex-col justify-between">
			<div
				class={[
					{
						'text-theme-red': card.suit === 'heart' || card.suit == 'diamond'
					}
				]}
			>
				<SuitIcon suit={card.suit} />
			</div>
			<div
				class={[
					'flex items-center justify-center sm:text-4xl',
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
						'text-theme-red': card.suit === 'heart' || card.suit == 'diamond'
					}
				]}
			>
				<SuitIcon suit={card.suit} />
			</div>
		</div>
	{/if}
</div>
