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
