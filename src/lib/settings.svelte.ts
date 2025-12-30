import { browser } from '$app/environment';
import { loadLS, saveLS } from '$lib/utils';

let isDarkMode = $state(false);
let isHardMode = $state(false);

type BoolCtx = {
	get: () => boolean;
	set: (v: boolean) => void;
	toggle: () => void;
};

export const darkMode: BoolCtx = {
	get: () => isDarkMode,
	set: (v) => (isDarkMode = v),
	toggle: () => (isDarkMode = !isDarkMode)
};

export const hardMode: BoolCtx = {
	get: () => isHardMode,
	set: (v) => (isHardMode = v),
	toggle: () => (isHardMode = !isHardMode)
};

let initialized = false;
export function initSettings() {
	if (initialized) return;
	initialized = true;

	if (!browser) return;

	// 1) 初期値ロード
	isDarkMode = loadLS('dark', false);
	isHardMode = loadLS('hard', false);

	// 2) 保存の購読開始
	$effect(() => saveLS('dark', isDarkMode));
	$effect(() => saveLS('hard', isHardMode));

	// 3) DOM反映
	$effect(() => {
		document.documentElement.classList.toggle('dark', isDarkMode);
	});
}
