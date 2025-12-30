<script lang="ts">
	import Dialog from '$lib/components/Dialog.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';

	let openAlert = $state(false);
	let openMessage = $state(false);
</script>

<Dropdown />

<Dialog bind:open={openAlert} autoClose>
	<div>This is an alert message!</div>
</Dialog>

<Dialog bind:open={openMessage}>
	<div>This is a dialog message!</div>
</Dialog>

<div class="flex gap-x-4 p-4">
	<button
		class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		onclick={() => {
			openAlert = true;
		}}
	>
		Show Alert
	</button>

	<button
		class="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
		onclick={() => {
			openMessage = true;
		}}
	>
		Show Message
	</button>
</div>
