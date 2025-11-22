<script lang="ts">
	import { BaccaratGame } from './game.svelte';
	import PlayField from './PlayField.svelte';
	import ScoreBoard from './ScoreBoard.svelte';

	const game = new BaccaratGame();
	let isFlipped = $state(false);
</script>

<div class="flex flex-col gap-y-4 px-2">
	<div class="flex gap-x-2">
		<PlayField name="Player" hand={game.pHand} total={game.pTotal} result={game.pResult} />
		<PlayField name="Banker" hand={game.bHand} total={game.bTotal} result={game.bResult} />
	</div>
	<div class="flex justify-center gap-x-2">
		<button
			disabled={game.isProcessing}
			onclick={async () => await game.play()}
			class="btnx-primary w-36">Play</button
		>
	</div>
	<ScoreBoard score={game.score} deckCount={game.deck.deck.length} />
</div>
