import { Deck, type Card } from '$lib/deck';

const sec = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms * 1000));

export type { Card };
export type PlayerResult = 'WIN' | 'LOSE' | 'DRAW' | undefined;
export type Winner = 'PLAYER' | 'BANKER' | 'DRAW' | undefined;
export type Score = Winner[][];
export class BaccaratGame {
	deckCount: number;
	deck: Deck;
	pHand = $state<Card[]>([]);
	pTotal = $state<number>(0);
	pResult = $state<PlayerResult>();
	bHand = $state<Card[]>([]);
	bTotal = $state<number>(0);
	bResult = $state<PlayerResult>();
	winner = $state<Winner>();
	score = $state<Score>([]);
	isProcessing = $state<boolean>(false);

	constructor(deckCount = 8) {
		this.deckCount = deckCount;
		this.deck = new Deck(deckCount);
	}

	private cardValue(card: Card): number {
		return card.value > 9 ? 0 : card.value;
	} // Cards 10, Jack, Queen, King are valued as 0; Ace is 1.

	private calcHand(hand: Card[]): number {
		const total = hand.reduce((sum, card) => sum + this.cardValue(card), 0);
		return total % 10;
	}

	private async dealInitialHands() {
		this.pHand = [];
		this.pTotal = 0;
		this.pResult = undefined;
		this.bHand = [];
		this.bTotal = 0;
		this.bResult = undefined;
		this.winner = undefined;

		await sec(1);
		this.pHand.push(this.deck.drawCard());
		this.bHand.push(this.deck.drawCard());
		this.pHand.push(this.deck.drawCard());
		this.bHand.push(this.deck.drawCard());
		this.pTotal = this.calcHand(this.pHand);
		this.bTotal = this.calcHand(this.bHand);
	}

	private checkForNaturalWin(): boolean {
		return this.pTotal >= 8 || this.bTotal >= 8;
	}

	private shouldPlayerDrawCard(): boolean {
		return this.pTotal <= 5;
	}

	private shouldBankerDrawCard(): boolean {
		if (this.pHand.length < 3) {
			return this.bTotal <= 5;
		} else {
			const p3 = this.cardValue(this.pHand[2]); // 0 to 9, where 10, J, Q, K are treated as 0
			const drawLimits = [3, 3, 4, 4, 5, 5, 6, 6, 2, 3]; // Index corresponds to player's third card value
			return this.bTotal <= drawLimits[p3]; // Banker draws based on player's third card
		}
	}

	private getResult() {
		if (this.pTotal === this.bTotal) {
			this.winner = 'DRAW';
			this.pResult = 'DRAW';
			this.bResult = 'DRAW';
		} else if (this.pTotal > this.bTotal) {
			this.winner = 'PLAYER';
			this.pResult = 'WIN';
			this.bResult = 'LOSE';
		} else {
			this.winner = 'BANKER';
			this.pResult = 'LOSE';
			this.bResult = 'WIN';
		}

		if (this.score.length === 0) {
			this.score = [[this.winner]];
			return;
		}
		const lastCol = this.score[this.score.length - 1];
		const colOwner = lastCol.find((w) => w !== 'DRAW'); // 過去のカラムの勝者 (DRAW 以外で最初に勝った人)
		// DRAW or カラムの勝者と同じ or まだ DRAW しかなく colOwner が未定の場合、前の勝敗と同じカラムにスタックされる
		if (this.winner === 'DRAW' || colOwner === this.winner || !colOwner) {
			this.score = [...this.score.slice(0, -1), [...lastCol, this.winner]];
			return;
		}
		this.score = [...this.score, [this.winner]]; // カラムの勝者と異なる場合は、新しいカラムを作成
	}

	private checkForReinitialize() {
		if (this.deck.deck.length < 6) {
			this.deck = new Deck(this.deckCount);
			this.score = [];
		}
	}

	public async play() {
		this.isProcessing = true;
		this.checkForReinitialize();

		await this.dealInitialHands();

		if (!this.checkForNaturalWin()) {
			if (this.shouldPlayerDrawCard()) {
				const newCard = this.deck.drawCard();
				this.pHand.push(newCard);
				this.pTotal = this.calcHand(this.pHand);
			}
			if (this.shouldBankerDrawCard()) {
				const newCard = this.deck.drawCard();
				this.bHand.push(newCard);
				this.bTotal = this.calcHand(this.bHand);
			}
		}

		await sec(1);
		this.getResult();
		this.isProcessing = false;
	}
}
