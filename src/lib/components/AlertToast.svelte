<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';

	let {
		open = $bindable(),
		message,
		duration = 1000
	}: {
		open: boolean;
		message: string;
		duration?: number; // 単位はミリ秒 (ms)
	} = $props();

	$effect(() => {
		if (open) {
			const timer = setTimeout(() => {
				open = false;
			}, duration);
			return () => clearTimeout(timer);
		}
	});
</script>

<Dialog
	{open}
	onInteractOutside={() => {
		open = false;
	}}
>
	<Portal>
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-start justify-center p-4">
			<Dialog.Content
				class="flex justify-center rounded bg-theme-light px-4 py-2 text-xl font-bold focus-none drop-shadow"
			>
				{message}
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
