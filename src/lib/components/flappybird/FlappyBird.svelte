<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { FlappyBirdGame } from './game';

	let canvas: HTMLCanvasElement | null = null;
	let game: FlappyBirdGame | null = null;

	function handleKeyDown() {
		game?.setFlying(true);
	}
	function handleKeyUp() {
		game?.setFlying(false);
	}

	onMount(() => {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		game = new FlappyBirdGame(ctx);
		game.start();

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
	});

	onDestroy(() => {
		game?.stop();
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
	});
</script>

<div class="flex h-screen w-full items-center justify-center">
	<canvas bind:this={canvas} width="600" height="600"></canvas>
</div>
