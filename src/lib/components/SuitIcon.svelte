<script lang="ts">
	import type { Suit } from '$lib/deck';
	import { Club, Diamond, Heart, Spade } from '@lucide/svelte';

	const { suit, iconClass = 'h-3 w-3 sm:h-5 sm:w-5' }: { suit: Suit; iconClass?: string } =
		$props();
</script>

{#if suit === 'heart'}
	<Heart class={iconClass} />
{:else if suit === 'diamond'}
	<Diamond class={iconClass} />
{:else if suit === 'club'}
	<Club class={iconClass} />
{:else if suit === 'spade'}
	<Spade class={iconClass} />
{/if}
