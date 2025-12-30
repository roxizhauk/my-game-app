import { answerWords, validWords } from '$lib/data';
import { gen2d } from '$lib/utils';
import { SvelteSet } from 'svelte/reactivity';

export type Status = 0 | 1 | 2; // 0: 灰 (不正解), 1: 黄 (場所違い), 2: 緑 (正解)
export type KeyColors = Record<string, Status>;
type Letter = { letter: string | undefined; color: Status | undefined };
type Word = Letter[];

export class WordleGame {
	readonly tries: number;
	readonly answer: string;
	words: Word[];
	keyColors: KeyColors = $state({});
	rowIndex = $state(0);
	isCleared = false;
	isDone = $state(false);

	constructor(tries: number = 6) {
		this.tries = tries;
		this.answer = this.genAnswer();
		this.words = $state(this.genDefaultWords(tries));
	}

	private genAnswer(): string {
		const randomIndex = Math.floor(Math.random() * answerWords.length);
		return answerWords[randomIndex];
	}

	private genDefaultWords(tries: number): Word[] {
		return gen2d<Letter>(tries, 5, () => ({ letter: undefined, color: undefined }));
	}

	private updateKeyColors() {
		const newColors: KeyColors = { ...this.keyColors };
		this.words[this.rowIndex].forEach(({ letter, color }) => {
			if (letter === undefined || color === undefined) return;
			if (newColors[letter] !== undefined) {
				newColors[letter] = Math.max(newColors[letter], color) as Status;
			} else {
				newColors[letter] = color;
			}
		});
		this.keyColors = newColors;
	}

	private validateWord(guess: string): boolean {
		return validWords.has(guess);
	}

	private validateGuessHard(guess: string): boolean {
		const needWords = this.genNeedWords();
		for (const needWord of needWords) {
			if (!guess.includes(needWord)) return false;
		}
		return true;
	}

	private genNeedWords(): string[] {
		const needWords: string[] = [];
		this.words.forEach((word) => {
			word.forEach(({ letter, color }) => {
				if (color === 2 || color === 1) {
					needWords.push(letter!);
				}
			});
		});
		return [...new SvelteSet(needWords)];
	}

	private validateGuessWithAnswer(guess: string): Letter[] {
		return guess.split('').map((letter, index) => {
			let color: Status = 0;
			if (this.answer[index] === letter) {
				color = 2;
			} else if (this.answer.includes(letter)) {
				color = 1;
			}
			return { letter, color };
		});
	}

	public submit(guess: string, isHardMode: boolean): { message: string } | undefined {
		if (!this.validateWord(guess)) {
			return { message: 'Invalid word' };
		}

		if (isHardMode) {
			if (!this.validateGuessHard(guess)) {
				return { message: 'Use all hits' };
			}
		}

		const result = this.validateGuessWithAnswer(guess);
		const newWords = [...this.words];
		newWords[this.rowIndex] = [...result];
		this.words = newWords;
		this.updateKeyColors();
		this.rowIndex += 1;
		this.isCleared = result.every(({ color }) => color === 2);
		this.isDone = this.isCleared || this.rowIndex >= this.tries;
	}
}
