<script lang="ts">
	import { BaccaratGame } from './game.svelte';
	import PlayField from './PlayField.svelte';
	import ScoreBoard from './ScoreBoard.svelte';

	const game = new BaccaratGame();
</script>

<div class="flex flex-col gap-y-4 px-2">
	<div class="flex gap-x-2">
		<PlayField name="Player" hand={game.pHand} total={game.pTotal} result={game.pResult} />
		<PlayField name="Banker" hand={game.bHand} total={game.bTotal} result={game.bResult} />
	</div>
	<button onclick={() => game.play()} class="btnx-primary mx-auto w-1/3">Play</button>
	<ScoreBoard score={game.score} deckCount={game.deck.deck.length} />
</div>
