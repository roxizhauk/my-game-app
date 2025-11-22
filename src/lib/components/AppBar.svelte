<script lang="ts">
	import { page } from '$app/state';
	import { loadLS, saveLS } from '$lib/ls';
	import { HouseIcon, MenuIcon, XIcon } from '@lucide/svelte';
	import { Dialog, Portal, Switch } from '@skeletonlabs/skeleton-svelte';
	import { onMount, setContext, type Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let isDarkMode = $state(false);
	let isHardMode = $state(false);
	setContext('isHardMode', () => isHardMode);

	onMount(() => {
		isDarkMode = loadLS('dark', false);
		isHardMode = loadLS('hard', false);
	});

	$effect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
			875;
		}
	});
</script>

<div class="pt-10">
	{@render children()}
</div>

<div class="absolute top-0 right-0 flex w-full items-start justify-between px-2 pt-2">
	<a href="/" class="cursor-pointer text-theme-base focus-none">
		<HouseIcon />
	</a>
	<Dialog>
		<Dialog.Trigger class="cursor-pointer text-theme-base focus-none">
			<MenuIcon />
		</Dialog.Trigger>
		<Portal>
			<Dialog.Backdrop class="fixed inset-0 z-50 bg-theme-white/60" />
			<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
				<Dialog.Content class="relative w-md space-y-2 card bg-theme-white p-4 shadow-xl">
					<Dialog.Title class="text-2xl font-bold">Settings</Dialog.Title>
					<Dialog.Description>
						<div class="flex gap-3">
							<Switch
								class="gap-x-2"
								checked={isDarkMode}
								onCheckedChange={() => {
									isDarkMode = !isDarkMode;
									saveLS('dark', isDarkMode);
								}}
							>
								<Switch.Control class="data-[state=checked]:bg-sky-400">
									<Switch.Thumb />
								</Switch.Control>
								<Switch.Label class="text-lg">Dark Mode</Switch.Label>
								<Switch.HiddenInput />
							</Switch>
							{#if page.url.pathname === '/wordle'}
								<Switch
									checked={isHardMode}
									onCheckedChange={() => {
										isHardMode = !isHardMode;
										saveLS('hard', isHardMode);
									}}
								>
									<Switch.Control class="data-[state=checked]:bg-sky-400">
										<Switch.Thumb />
									</Switch.Control>
									<Switch.Label class="text-lg">Hard Mode</Switch.Label>
									<Switch.HiddenInput />
								</Switch>
							{/if}
						</div>
					</Dialog.Description>
					<Dialog.CloseTrigger class="absolute top-0 right-0">
						<XIcon class="h-5 w-5" />
					</Dialog.CloseTrigger>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
	</Dialog>
</div>
