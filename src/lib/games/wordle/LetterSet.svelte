<script lang="ts">
	let { word, setWord }: { word: string; setWord: (word: string) => void } = $props();
</script>

<button
	class="btnx btnx-transition rounded bg-theme-light py-1.5 font-mono font-bold focus-none"
	onclick={() => setWord(word)}
>
	{word.toUpperCase()}
</button>
