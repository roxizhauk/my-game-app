<script lang="ts">
	import Dialog from '$lib/components/Dialog.svelte';
	import { cn } from '$lib/utils';
	import ClearBar from './ClearBar.svelte';
	import { OctordleGame } from './game.svelte';
	import Keyboard from './OctordleKeyboard.svelte';

	let game = $state(new OctordleGame());
	let guess = $state('');

	let openAlert = $state(false);
	let openResult = $state(false);
	let message = $state('');

	function handleSubmit() {
		if (game.isDone) return;
		const result = game.submit(guess);

		if (result) {
			openAlert = true;
			message = result.message;
			return;
		}

		if (game.isCleared.every((c) => c)) {
			openResult = true;
			message = 'Congratulations!';
			guess = '';
			return;
		}

		if (game.isDone) {
			openResult = true;
			message = `Answers: ${game.answers.join(', ')}`;
			guess = '';
			return;
		}

		guess = '';
	}

	function handleNewGame() {
		game = new OctordleGame();
		guess = '';
		openResult = false;
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

		if (/^[1-8]$/.test(pressedKey)) {
			scrollTo(parseInt(pressedKey));
			return;
		}
	}

	function scrollTo(index: number) {
		const boardElement = document.getElementById(`w${index}`);
		if (boardElement) {
			boardElement.scrollIntoView({
				behavior: 'smooth', // スムーズなスクロール
				block: 'start' // 要素の上端がビューポートの上端に揃うようにスクロール
			});
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<Dialog bind:open={openAlert} autoClose>
	<div>{message}</div>
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

<div class="flex flex-col gap-y-9 pb-36 sm:pb-48">
	<div class="mx-auto grid grid-cols-2 gap-4">
		{#each game.wordles as wordle, index}
			<div aria-label="Wordle" id={`w${index + 1}`} class="mx-auto grid grid-cols-5 gap-1">
				{#each wordle as word, rowIndex}
					{#each word as { letter, color }, colIndex}
						{@const displayLetter =
							game.rowIndices[index] === rowIndex
								? game.isCleared[index]
									? letter
									: guess[colIndex]
								: letter}
						<div
							class={cn([
								'flex h-8 w-8 items-center justify-center rounded border-2 font-mono text-lg font-black select-none sm:h-10 sm:w-10 sm:text-2xl',
								displayLetter ? 'border-theme-base' : 'border-theme-light',
								{
									'border-none text-white': color !== undefined,
									'bg-theme-dark': color === 0,
									'bg-theme-yellow': color === 1,
									'bg-theme-green': color === 2
								}
							])}
						>
							{displayLetter}
						</div>
					{/each}
				{/each}
			</div>
		{/each}
	</div>
</div>

<div
	class="fixed bottom-0 z-10 flex w-full flex-col items-center justify-center gap-y-1 bg-theme-white/80 p-1 sm:max-w-2xl sm:p-2"
>
	<ClearBar isCleared={game.isCleared} {scrollTo} />
	<Keyboard
		bind:guess
		keyColors={game.keyColors}
		isDone={game.isDone}
		{handleSubmit}
		{handleNewGame}
	/>
</div>
