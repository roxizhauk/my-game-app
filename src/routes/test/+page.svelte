<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	let canvas: HTMLCanvasElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;
	let timer: number | null = null;

	function stopGame() {
		if (timer !== null) {
			window.clearInterval(timer);
			timer = null;
		}
	}

	let isFlying = false;

	let posY = 300;
	let offset = 0;
	let speed = 10;
	let velocityY = -20;
	let accelY = 5;

	function tick() {
		velocityY += isFlying ? -accelY : accelY;
		posY += velocityY;
		offset += speed;
		if (offset % 100 == 0) speed += 2;
		paint();
	}

	function paint() {
		if (!ctx) return;
		ctx.fillStyle = 'green';
		ctx.fillRect(0, 0, 600, 600);

		ctx.fillStyle = 'brown';
		ctx.beginPath();
		ctx.moveTo(0, 0);

		for (let i = 0; i <= 600; i += 10) {
			const up = 200 + Math.sin(((i + offset) * Math.PI) / 360) * 80;
			ctx.lineTo(i, up);
			if (i == 10 && posY < up) stopGame();
		}

		ctx.lineTo(600, 0);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(0, 600);
		for (let i = 0; i <= 600; i += 10) {
			const down = 400 + Math.sin(((i + offset) * Math.PI) / 340) * 80;
			ctx.lineTo(i, down);
			if (i == 10 && posY + 10 > down) stopGame();
		}
		ctx.lineTo(620, 600);
		ctx.fill();

		ctx.fillStyle = 'white';
		ctx.fillRect(10, posY, 10, 10);
		ctx.fillText(offset.toString(), 500, 50);
	}

	function handleKeyDown() {
		isFlying = true;
	}

	function handleKeyUp() {
		isFlying = false;
	}

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.font = '24px sans-serif';
		paint(); // 初期描画

		timer = window.setInterval(tick, 100);
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
	});

	onDestroy(() => {
		stopGame();
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
	});
</script>

<div class="flex h-screen w-full items-center justify-center">
	<canvas bind:this={canvas} width="600" height="600"></canvas>
</div>
