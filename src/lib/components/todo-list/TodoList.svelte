<script lang="ts">
	import { TrashIcon } from '@lucide/svelte';
	import { flip } from 'svelte/animate';
	import { receive, send } from './transition.js';
	import { type Todo } from './utils.js';

	let { todos, remove }: { todos: Todo[]; remove: (todo: Todo) => void } = $props();
</script>

<ul class="">
	{#each todos as todo (todo.id)}
		<li
			class={['pt-4', { 'opacity-40': todo.done }]}
			in:receive={{ key: todo.id }}
			out:send={{ key: todo.id }}
			animate:flip={{ duration: 200 }}
		>
			<label class="flex size-full items-center gap-x-2 p-2 shadow">
				<input type="checkbox" bind:checked={todo.done} />
				<span class="flex-1">{todo.description}</span>
				<button onclick={() => remove(todo)} aria-label="Remove">
					<TrashIcon />
				</button>
			</label>
		</li>
	{/each}
</ul>
