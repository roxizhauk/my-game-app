<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(),
		children
	}: {
		open: boolean;
		children: Snippet;
	} = $props();
</script>

<Dialog
	{open}
	onInteractOutside={() => {
		open = false;
	}}
>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-theme-white/90" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content
				class="flex w-lg justify-center rounded bg-theme-light p-4 focus-none drop-shadow"
			>
				{@render children()}
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
