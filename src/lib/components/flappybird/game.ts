export class FlappyBirdGame {
	private ctx: CanvasRenderingContext2D;
	private timer: number | null = null;
	private posY = 300;
	private offset = 0;
	private speed = 10;
	private velocityY = -20;
	private accelY = 5;
	private isFlying = false;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.ctx.font = '24px sans-serif';
	}

	start() {
		if (this.timer !== null) return;
		this.timer = window.setInterval(() => this.tick(), 100);
	}

	stop() {
		if (this.timer === null) return;
		window.clearInterval(this.timer);
		this.timer = null;
	}

	setFlying(flying: boolean) {
		this.isFlying = flying;
	}

	private tick() {
		this.velocityY += this.isFlying ? -this.accelY : this.accelY;
		this.posY += this.velocityY;
		this.offset += this.speed;
		if (this.offset % 100 === 0) this.speed += 2;

		this.paint();
	}

	private paint() {
		const ctx = this.ctx;
		ctx.fillStyle = 'green';
		ctx.fillRect(0, 0, 600, 600);

		ctx.fillStyle = 'brown';
		ctx.beginPath();
		ctx.moveTo(0, 0);

		for (let i = 0; i <= 600; i += 10) {
			const up = 200 + Math.sin(((i + this.offset) * Math.PI) / 360) * 80;
			ctx.lineTo(i, up);
			if (i == 10 && this.posY < up) this.stop();
		}

		ctx.lineTo(600, 0);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(0, 600);
		for (let i = 0; i <= 600; i += 10) {
			const down = 400 + Math.sin(((i + this.offset) * Math.PI) / 340) * 80;
			ctx.lineTo(i, down);
			if (i == 10 && this.posY + 10 > down) this.stop();
		}
		ctx.lineTo(620, 600);
		ctx.fill();

		ctx.fillStyle = 'white';
		ctx.fillRect(10, this.posY, 10, 10);
		ctx.fillText(this.offset.toString(), 500, 50);
	}
}
