type Primitive = number | string | boolean | null | undefined;
type ValueFactory<T> = () => T;
type ValueOrFactory<T> = Primitive | ValueFactory<T>;

/**
 * 二次元配列を初期化します。
 * 初期値をオブジェクトにする場合は、() => ({}) のようにファクトリー関数を渡してください。
 * @param row - 行数
 * @param col - 列数
 * @param valueOrFactory - プリミティブ値、または要素の値を返すファクトリー関数
 */
export const gen2d = <T>(row: number, col: number, valueOrFactory: ValueOrFactory<T>): T[][] => {
	// 要素の値を決定するためのファクトリー関数を定義
	const getElementValue = (): T => {
		if (typeof valueOrFactory === 'function') return valueOrFactory();
		return valueOrFactory as T; // それ以外（プリミティブ）の場合はその値をそのまま返す
	};

	return [...Array(row)].map(() => [...Array(col)].map(getElementValue));
};

import { browser } from '$app/environment';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type { ClassValue };
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function loadLS<T>(key: string, defaultData: T): T {
	try {
		if (!browser) return defaultData;
		const storedString = localStorage.getItem(key);
		if (!storedString) {
			throw new Error('no stored data');
		}

		const parsedValue: unknown = JSON.parse(storedString);

		if (Array.isArray(defaultData)) {
			if (!Array.isArray(parsedValue)) {
				throw new Error('parsed value is not an array');
			}
			return parsedValue as T;
		}

		if (typeof defaultData !== 'object' || defaultData === null) {
			if (parsedValue === undefined) {
				throw new Error('parsed value is undefined');
			}
			return parsedValue as T;
		}

		const parsedObj = parsedValue as Record<string, unknown>;
		const dataToLoad: Partial<T> = {};
		for (const k in defaultData) {
			if (parsedObj[k] !== undefined) {
				dataToLoad[k as keyof T] = parsedObj[k] as T[keyof T];
			}
		}
		return { ...(defaultData as object), ...(dataToLoad as object) } as T;
	} catch (e) {
		console.error(`Error loading data for "${key}":`, e);
		return defaultData;
	}
}

export function saveLS(key: string, data: unknown) {
	if (!browser) return;
	localStorage.setItem(key, JSON.stringify(data));
}
