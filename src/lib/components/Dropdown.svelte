<script lang="ts">
	import { page } from '$app/state';
	import { darkMode, hardMode } from '$lib/settings.svelte';
	import { Bell, CheckIcon, MenuIcon, Moon, Sun } from '@lucide/svelte';
	import { DropdownMenu } from 'bits-ui';

	let isDarkMode = $derived(darkMode.get());
	function handleDarkMode() {
		darkMode.toggle();
	}

	let isHardMode = $derived(hardMode.get());
	function handleHardMode() {
		hardMode.toggle();
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="pointer-events-auto absolute top-2 right-2 cursor-pointer focus-none focus:rounded-sm focus:ring-2 focus:ring-blue-300"
	>
		<MenuIcon class="size-6" />
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="z-50 mr-2 h-full w-64 cursor-pointer rounded-md bg-theme-dark p-2 shadow-sm focus-none"
			onCloseAutoFocus={(e) => e.preventDefault()}
			sideOffset={8}
		>
			<DropdownMenu.CheckboxItem
				checked={isDarkMode}
				onclick={handleDarkMode}
				class="flex h-10 items-center rounded-md px-2 text-sm font-medium ring-0! ring-transparent! focus-none transition-colors duration-300 hover:bg-theme-base"
			>
				{#snippet children({ checked })}
					<div class="flex items-center pr-4">
						{#if checked}
							<Moon class="mr-2 size-5" />
						{:else}
							<Sun class="mr-2 size-5" />
						{/if}
						Dark Mode
					</div>
					{#if checked}
						<CheckIcon class="ml-auto size-5" />
					{/if}
				{/snippet}
			</DropdownMenu.CheckboxItem>

			{#if page.url.pathname === '/wordle'}
				<DropdownMenu.CheckboxItem
					checked={isHardMode}
					onclick={handleHardMode}
					class="flex h-10 items-center rounded-md px-2 text-sm font-medium ring-0! ring-transparent! focus-none transition-colors duration-300 hover:bg-theme-base"
				>
					{#snippet children({ checked })}
						<div class="flex items-center pr-4">
							<Bell class="mr-2 size-5" />
							Hard Mode
						</div>
						{#if checked}
							<CheckIcon class="ml-auto size-5" />
						{/if}
					{/snippet}
				</DropdownMenu.CheckboxItem>
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
