<script lang="ts">
	import type { Suit } from '$lib/deck';
	import { cn, type ClassValue } from '$lib/utils';
	import { Club, Diamond, Heart, Spade } from '@lucide/svelte';

	interface Props {
		suit: Suit;
		className?: ClassValue;
	}

	const { suit, className }: Props = $props();
</script>

<div class={cn(['size-3 sm:size-5', className])}>
	{#if suit === 'heart'}
		<Heart />
	{:else if suit === 'diamond'}
		<Diamond />
	{:else if suit === 'club'}
		<Club />
	{:else if suit === 'spade'}
		<Spade />
	{/if}
</div>
