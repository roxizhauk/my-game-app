<script lang="ts">
	import type { KeyColors } from './game.svelte';
	import KeyButton from './WordleKeyButton.svelte';

	const keyboard = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['Back', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter']
	];

	type Props = {
		guess: string;
		keyColors: KeyColors;
		isDone: boolean;
		handleSubmit: () => void;
		handleNewGame: () => void;
	};

	let { guess = $bindable(), keyColors, isDone, handleSubmit, handleNewGame }: Props = $props();

	function handleKeyClick(key: string) {
		if (key === 'Back') {
			guess = guess.slice(0, -1);
			return;
		}

		if (key === 'Enter') {
			handleSubmit();
			return;
		}

		if (key === 'New') {
			handleNewGame();
			return;
		}

		if (guess.length < 5) {
			guess += key;
			return;
		}
	}
</script>

<div class="flex flex-col gap-1 px-1 sm:px-6">
	{#each keyboard as row}
		<div class="flex gap-1">
			{#each row as key}
				<KeyButton
					key={isDone && key === 'Enter' ? 'New' : key}
					status={keyColors[key]}
					{handleKeyClick}
				/>
			{/each}
		</div>
	{/each}
</div>
