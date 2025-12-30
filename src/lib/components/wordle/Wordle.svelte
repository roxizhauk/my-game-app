<script lang="ts">
	import Dialog from '$lib/components/Dialog.svelte';
	import { hardMode } from '$lib/settings.svelte';
	import { cn } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import { WordleGame } from './game.svelte';
	import LetterSet from './LetterSet.svelte';
	import Keyboard from './WordleKeyboard.svelte';

	const wordList = [
		'audio',
		'certy',
		'party',
		'stern',
		'dirty',
		'light',
		'arose',
		'guilt',
		'guild',
		'stone',
		'mores',
		'poise'
	];

	let isHardMode = $derived(hardMode.get());

	let game = $state(new WordleGame());
	let guess = $state('');

	let openAlert = $state(false);
	let openResult = $state(false);
	let message = $state('');

	function handleSubmit() {
		if (game.isDone) return;
		const result = game.submit(guess, isHardMode);

		if (result) {
			openAlert = true;
			message = result.message;
			return;
		}

		if (game.isCleared) {
			openResult = true;
			message = 'Congratulations!';
			guess = '';
			return;
		}

		if (game.isDone) {
			openResult = true;
			message = `Answer: ${game.answer}`;
			guess = '';
			return;
		}

		guess = '';
	}

	function handleNewGame() {
		game = new WordleGame();
		guess = '';
		openResult = false;
	}

	function setWord(word: string) {
		guess = word.toUpperCase();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (game.isDone) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return; // Don't handle combined keys like Cmd + R

		const pressedKey = e.key;
		if (pressedKey === 'Backspace' || pressedKey === 'Delete') {
			if (guess.length === 0) return;
			guess = guess.slice(0, -1);
			return;
		}

		if (pressedKey === 'Enter') {
			if (guess.length < 5) return;
			e.preventDefault(); // Prevent triggering button's onClick event
			handleSubmit();
			return;
		}

		if (/^[a-zA-Z]$/.test(pressedKey)) {
			if (guess.length === 5) return;
			guess += pressedKey.toUpperCase();
			return;
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<Dialog bind:open={openAlert} autoClose>
	<div class="w-full">{message}</div>
</Dialog>

<Dialog bind:open={openResult}>
	<div class="flex flex-col items-center justify-center gap-2">
		<div class="text-xl font-bold sm:text-2xl">
			{message}
		</div>
		<button
			onclick={handleNewGame}
			class="btnx btnx-transition rounded bg-theme-green px-4 py-1 text-xl font-bold text-theme-white focus-none"
			>New Game</button
		>
	</div>
</Dialog>

<div class="flex flex-col gap-y-9">
	<div class="mx-auto grid grid-cols-5 gap-2">
		{#each game.words as word, rowIndex}
			{#each word as { letter, color }, colIndex}
				<div
					class={cn([
						'flex h-14 w-14 items-center justify-center rounded border-4 font-mono text-3xl font-black select-none',
						game.rowIndex === rowIndex && guess[colIndex]
							? 'border-theme-base'
							: 'border-theme-light',
						{
							'border-none text-white': color !== undefined,
							'bg-theme-dark': color === 0,
							'bg-theme-yellow': color === 1,
							'bg-theme-green': color === 2
						}
					])}
				>
					{#if game.rowIndex === rowIndex}
						{#if guess[colIndex]}
							<span in:fade>
								{guess[colIndex]}
							</span>
						{/if}
					{:else}
						<span>
							{letter}
						</span>
					{/if}
				</div>
			{/each}
		{/each}
	</div>

	<Keyboard
		bind:guess
		keyColors={game.keyColors}
		isDone={game.isDone}
		{handleSubmit}
		{handleNewGame}
	/>

	<div class="grid grid-cols-4 gap-1 px-1 sm:gap-3 sm:px-3">
		{#each wordList as word}
			<LetterSet {word} {setWord} />
		{/each}
	</div>
</div>
