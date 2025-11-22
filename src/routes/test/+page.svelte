<script lang="ts">
	import TodoList from '$lib/components/todo-list';
	import { defaultTodos, type Todo } from '$lib/components/todo-list/utils';

	const todos = $state(defaultTodos);

	let uid = todos.length + 1;

	function remove(todo: Todo) {
		const index = todos.indexOf(todo);
		todos.splice(index, 1);
	}
</script>

<div class="board mx-auto grid max-w-xl gap-4">
	<input
		class="col-span-2 mr-4 p-2 text-2xl"
		placeholder="what needs to be done?"
		onkeydown={(e) => {
			if (e.key !== 'Enter') return;

			todos.push({
				id: uid++,
				done: false,
				description: e.currentTarget.value
			});

			e.currentTarget.value = '';
		}}
	/>

	<div class="todo">
		<h2 class="text-4xl">todo</h2>
		<TodoList todos={todos.filter((t) => !t.done)} {remove} />
	</div>

	<div class="done">
		<h2 class="text-4xl">done</h2>
		<TodoList todos={todos.filter((t) => t.done)} {remove} />
	</div>
</div>
