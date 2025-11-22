export type Todo = (typeof defaultTodos)[number];
export const defaultTodos = [
	{ id: 1, done: false, description: 'write some docs' },
	{ id: 2, done: false, description: 'start writing blog post' },
	{ id: 3, done: true, description: 'buy some milk' },
	{ id: 4, done: false, description: 'mow the lawn' },
	{ id: 5, done: false, description: 'feed the turtle' },
	{ id: 6, done: false, description: 'fix some bugs' }
];
