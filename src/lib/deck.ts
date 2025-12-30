export type Suit = 'heart' | 'diamond' | 'club' | 'spade';
export type Card = { suit: Suit; value: number };
export class Deck {
	deck: Card[];
	suits: Suit[] = ['heart', 'diamond', 'club', 'spade'];

	constructor(deckCount: number) {
		this.deck = this.createDeck(deckCount);
		this.shuffleDeck();
	}

	createDeck(deckCount: number): Card[] {
		return [...Array(deckCount)].flatMap(() =>
			this.suits.flatMap((suit) => [...Array(13)].map((_, i) => ({ suit, value: i + 1 })))
		);
	}

	shuffleDeck(): void {
		for (let i = this.deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
		}
	}

	drawCard(): Card {
		return this.deck.pop() as Card;
	}
}
