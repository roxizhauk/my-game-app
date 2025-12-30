<script lang="ts">
	import { gen2d, loadLS, saveLS } from '$lib/utils';
	import { onMount } from 'svelte';
	import SudokuCell from './SudokuCell.svelte';
	import SudokuFrame from './SudokuFrame.svelte';
	import SudokuKeyboard from './SudokuKeyboard.svelte';
	import { SudokuGame, type CellIndex, type SudokuGrid, type SudokuNum } from './game.svelte';

	let game = $state<SudokuGame>();
	let cellIndex: CellIndex = $state({ row: undefined, col: undefined });
	let check: boolean[][] = $state(gen2d(9, 9, false));
	let count: number[] = $derived.by(() => {
		let count: number[] = Array(9).fill(0);
		if (game?.puzzle && game?.inputs) {
			for (let r = 0; r < 9; r++) {
				for (let c = 0; c < 9; c++) {
					const p = game.puzzle[r][c];
					const i = game.inputs[r][c];
					if (p) count[p - 1]++;
					if (i) count[i - 1]++;
				}
			}
		}
		return count;
	});

	onMount(() => {
		const savedSolution = loadLS('sudoku:solution', []);
		const savedPuzzle = loadLS('sudoku:puzzle', []);
		const savedInputs = loadLS('sudoku:inputs', []);
		if (savedSolution.length === 9 && savedPuzzle.length === 9 && savedInputs.length === 9) {
			game = new SudokuGame(
				savedSolution as SudokuGrid,
				savedPuzzle as SudokuGrid,
				savedInputs as SudokuGrid
			);
		} else {
			game = new SudokuGame();
			saveLS('sudoku:solution', game.solution);
			saveLS('sudoku:puzzle', game.puzzle);
			saveLS('sudoku:inputs', game.inputs);
		}
	});

	function resetGame() {
		game = new SudokuGame();
		saveLS('sudoku:solution', game.solution);
		saveLS('sudoku:puzzle', game.puzzle);
		saveLS('sudoku:inputs', game.inputs);
	}

	function checkInputs() {
		if (!game) return;
		check = game.checkInputs();
		cellIndex = { row: undefined, col: undefined };
	}

	function resetInputs() {
		if (!game) return;
		game.resetInputs();
		check = gen2d(9, 9, false);
		cellIndex = { row: undefined, col: undefined };
	}

	function handleKeyClick(num: SudokuNum) {
		if (!game) return;
		game.updateInputs(cellIndex, num);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (!game) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return; // Don't handle combined keys like Cmd + R
		const pressedKey = e.key;
		const { row, col } = cellIndex;
		if (row === undefined || col === undefined) return;
		e.preventDefault();
		if (pressedKey === 'Backspace' || pressedKey === 'Delete') {
			game.updateInputs(cellIndex, 0);
			return;
		}
		if (/^[1-9]$/.test(pressedKey)) {
			game.updateInputs(cellIndex, parseInt(pressedKey) as SudokuNum);
			return;
		}
	}

	$effect(() => {
		if (!game) return;
		saveLS('sudoku:inputs', game.inputs);
	});
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="flex h-screen items-center justify-center focus-none">
	{#if game}
		<div class="flex flex-col items-center justify-center gap-y-3">
			<div class="grid grid-cols-9 border-5 border-theme-dark">
				{#each Array(9) as _, row}
					{#each Array(9) as _, col}
						<SudokuFrame {row} {col}>
							{#if game.puzzle[row][col] !== 0}
								<div
									class="flex size-full items-center justify-center bg-theme-light px-2.5 py-1 focus-none"
								>
									{game.puzzle[row][col]}
								</div>
							{:else if check[row][col]}
								<div
									class="size-full bg-theme-green px-2.5 py-1 text-center text-theme-white focus-none"
								>
									{game.inputs[row][col]}
								</div>
							{:else}
								<SudokuCell
									value={game.inputs[row][col] || 0}
									active={cellIndex.row === row && cellIndex.col === col}
									onclick={() => {
										cellIndex = { row, col };
									}}
								/>
							{/if}
						</SudokuFrame>
					{/each}
				{/each}
			</div>

			<SudokuKeyboard {count} onClick={handleKeyClick} />

			<div class="flex gap-x-2">
				<button
					onclick={checkInputs}
					class="btnx btnx-transition rounded bg-theme-green px-2.5 py-1 font-bold text-white focus-none"
					>Check</button
				>
				<button
					onclick={resetInputs}
					class="btnx btnx-transition rounded bg-theme-red px-2.5 py-1 font-bold text-white focus-none"
					>Clear</button
				>
				<button
					onclick={resetGame}
					class="btnx btnx-transition rounded bg-theme-dark px-2.5 py-1 font-bold text-white focus-none"
					>New Game</button
				>
			</div>
		</div>
	{:else}
		<div>Loading...</div>
	{/if}
</div>
