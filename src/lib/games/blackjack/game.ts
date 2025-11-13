import { type Card, Deck } from '$lib/deck';

export type GameState = '' | undefined;
export type PlayerResult = 'WIN' | 'LOSE' | 'DRAW';
export type Winner = 'PLAYER' | 'DEALER' | 'DRAW';
export type Result = ReturnType<typeof BlackjackGame.prototype.play>;
export class BlackjackGame {
	deckCount: number;
	deck: Deck;
	state: GameState;
	pHand: Card[] = [];
	pTotal = 0;
	pResult: PlayerResult = 'DRAW';
	dHand: Card[] = [];
	dTotal = 0;
	dResult: PlayerResult = 'DRAW';
	winner: Winner = 'DRAW';

	constructor(deckCount: number) {
		this.deckCount = deckCount;
		this.deck = new Deck(deckCount);
	}

	private calcHand(hand: Card[]): number {
		let total = 0;
		let aceCount = 0;
		hand.forEach(({ value }) => {
			if (value >= 10) {
				total += 10; // Jack, Queen, King are worth 10
			} else if (value === 1) {
				aceCount++;
				total += 11; // Ace is worth 11 initially
			} else {
				total += value;
			}
		});

		while (total > 21 && aceCount > 0) {
			total -= 10;
			aceCount--;
		} // Adjust for aces if value exceeds 21

		return total;
	}

	private dealInitialHands() {
		this.pHand = [this.deck.drawCard(), this.deck.drawCard()];
		this.dHand = [this.deck.drawCard(), this.deck.drawCard()];
		this.pTotal = this.calcHand(this.pHand);
		this.dTotal = this.calcHand(this.dHand);
	}

	hitOrStand() {
		return window.confirm('Do you want to hit? (Cancel = you stand)');
	}

	playerTurn() {
		while (this.pTotal < 21) {
			const isHit = this.hitOrStand();
			if (isHit) {
				const newCard = this.deck.drawCard();
				this.pHand.push(newCard);
				this.pTotal = this.calcHand(this.pHand);
				console.log('Player hits:', newCard);
			} else {
				break;
			}
		}
	}

	dealerTurn() {
		// Dealer's turn: dealer hits until value >= 17
		while (this.dTotal < 17) {
			const newCard = this.deck.drawCard();
			this.dHand.push(newCard);
			this.dTotal = this.calcHand(this.dHand);
			console.log('Dealer hits:', newCard);
		}
	}

	result() {
		if (this.pTotal === this.dTotal) {
			this.winner = 'DRAW';
			this.pResult = 'DRAW';
			this.dResult = 'DRAW';
		} else if (this.pTotal > this.dTotal) {
			this.winner = 'PLAYER';
			this.pResult = 'WIN';
			this.dResult = 'LOSE';
		} else {
			this.winner = 'DEALER';
			this.pResult = 'LOSE';
			this.dResult = 'WIN';
		}
	}

	play() {
		this.dealInitialHands();

		this.playerTurn();

		if (this.pTotal > 21) {
			this.winner = 'DEALER';
			this.pResult = 'LOSE';
			this.dResult = 'WIN';
			return {
				pHand: this.pHand,
				dHand: this.dHand,
				pTotal: this.pTotal,
				dTotal: this.dTotal,
				pResult: this.pResult,
				dResult: this.dResult,
				winner: this.winner
			};
		}

		this.dealerTurn();

		if (this.dTotal > 21) {
			this.winner = 'PLAYER';
			this.pResult = 'WIN';
			this.dResult = 'LOSE';
			return {
				pHand: this.pHand,
				dHand: this.dHand,
				pTotal: this.pTotal,
				dTotal: this.dTotal,
				pResult: this.pResult,
				dResult: this.dResult,
				winner: this.winner
			};
		}

		this.result();

		return {
			pHand: this.pHand,
			dHand: this.dHand,
			pTotal: this.pTotal,
			dTotal: this.dTotal,
			pResult: this.pResult,
			dResult: this.dResult,
			winner: this.winner
		};
	}
}
