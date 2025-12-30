import { answerWords, validWords } from '$lib/data';
import { gen2d } from '$lib/utils';
import { SvelteSet } from 'svelte/reactivity';

export type Status = 0 | 1 | 2; // 0: 灰 (不正解), 1: 黄 (場所違い), 2: 緑 (正解)
export type KeyColors = Record<string, Status>;
type Letter = { letter: string | undefined; color: Status | undefined };
type Wordle = Letter[][];

export class OctordleGame {
	readonly tries: number;
	readonly answers: string[];
	wordles: Wordle[];
	keyColors = $state<KeyColors>({});
	rowIndices = $state<number[]>(Array(8).fill(0));
	isCleared = $state<boolean[]>(Array(8).fill(false));
	isDone = $state<boolean>(false);

	constructor(tries: number = 13) {
		this.tries = tries;
		this.answers = this.genAnswers();
		this.wordles = $state(this.genDefWordles(tries));
	}

	private genAnswers(): string[] {
		const randomIndices = new SvelteSet<number>();
		while (randomIndices.size < 8) {
			randomIndices.add(Math.floor(Math.random() * answerWords.length));
		}
		return [...randomIndices].map((i) => answerWords[i]);
	}

	private genDefWordles(tries: number): Wordle[] {
		return [...Array(8)].map(() =>
			gen2d<Letter>(tries, 5, () => ({ letter: undefined, color: undefined }))
		);
	}

	private updateKeyColors(results: Letter[][]) {
		const newColors: KeyColors = { ...this.keyColors };
		results.forEach((result) => {
			result.forEach(({ letter, color }) => {
				if (letter === undefined || color === undefined) return;
				if (newColors[letter] !== undefined) {
					newColors[letter] = Math.max(newColors[letter], color) as Status;
				} else {
					newColors[letter] = color;
				}
			});
		});
		this.keyColors = newColors;
	}

	private validateWord(guess: string): boolean {
		return validWords.has(guess);
	}

	private validateGuess(guess: string): Letter[][] {
		return this.answers.map((answer) =>
			guess.split('').map((letter, i) => {
				let color: Status = 0;
				if (answer[i] === letter) {
					color = 2;
				} else if (answer.includes(letter)) {
					color = 1;
				}
				return { letter, color };
			})
		);
	}

	public submit(guess: string): { message: string } | undefined {
		if (!this.validateWord(guess)) {
			return { message: 'Invalid word' };
		}

		const results = this.validateGuess(guess);

		const newWordles = [...this.wordles];
		const newRowIndices = [...this.rowIndices];
		const newIsCleared = [...this.isCleared];
		for (let i = 0; i < 8; i++) {
			if (this.isCleared[i]) continue;
			const rowIndex = newRowIndices[i];
			newWordles[i][rowIndex] = [...results[i]];
			const isCleared = results[i].every(({ color }) => color === 2);
			if (isCleared) {
				newIsCleared[i] = true;
			} else {
				newRowIndices[i] += 1;
			}
		}
		this.wordles = newWordles;
		this.rowIndices = newRowIndices;
		this.isCleared = newIsCleared;

		this.updateKeyColors(results);
		this.isDone = this.isCleared.every((c) => c) || this.rowIndices.some((r) => r >= this.tries);
	}
}
