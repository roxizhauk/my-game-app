<script lang="ts">
	import { cn, type ClassValue } from '$lib/utils';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		children: Snippet;
		autoClose?: boolean;
		duration?: number; // 単位はミリ秒 (ms)
		className?: ClassValue;
	}

	let {
		open = $bindable(),
		children,
		autoClose = false,
		duration = 1000,
		className
	}: Props = $props();

	$effect(() => {
		if (!open || !autoClose) return;

		const timer = setTimeout(() => {
			open = false;
		}, duration);

		return () => clearTimeout(timer);
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/70" />
		<Dialog.Content
			class={cn([
				'fixed top-8 left-1/2 z-50 flex h-10 w-full max-w-lg -translate-x-1/2 items-center rounded-md border-2 border-theme-dark bg-theme-white pl-2 shadow-sm',
				className
			])}
			onInteractOutside={() => {
				open = false;
			}}
		>
			{@render children?.()}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
