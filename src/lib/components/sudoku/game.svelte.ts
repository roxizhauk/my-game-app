import { gen2d } from '$lib/utils';
export type SudokuNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type SudokuGrid = (SudokuNum | 0)[][];
export type CellIndex = { row: number | undefined; col: number | undefined };

export class SudokuGame {
	solution: SudokuGrid = $state([]);
	puzzle: SudokuGrid = $state([]);
	inputs: SudokuGrid = $state([]);

	constructor(savedSolution?: SudokuGrid, savedPuzzle?: SudokuGrid, savedInputs?: SudokuGrid) {
		if (savedSolution && savedPuzzle && savedInputs) {
			this.solution = savedSolution; // 復元モード
			this.puzzle = savedPuzzle;
			this.inputs = savedInputs;
		} else {
			this.solution = this.genSolution(); // 新規モード
			this.puzzle = this.genPuzzle();
			this.inputs = gen2d(9, 9, 0);
		}
	}

	private genSolution(): SudokuGrid {
		const grid: SudokuGrid = gen2d(9, 9, 0);
		const solve = (cell = 0): boolean => {
			if (cell === 81) return true; // 全部埋まったら完成; 仕様上、81 まで必ず行くのが前提条件としてある
			const row = Math.floor(cell / 9);
			const col = cell % 9;
			// ダメだった親のセルに入れる数字は省いてないので、またランダムでその数字も試すことはある; 過去に失敗した数字も再び候補に出てくる
			for (const num of this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9] as SudokuNum[])) {
				if (this.isValid(grid, row, col, num)) {
					grid[row][col] = num;
					if (solve(cell + 1)) return true;
					grid[row][col] = 0 as SudokuNum; // 子が false で戻ってきた瞬間（ここがバックトラック）
				}
			}
			return false; // 親の for ループが再開する; 次のセルに数字が入らない場合は、親のセルをもう一度試す
		};
		solve(); // 一度の記述で、cell=81 まで走るようにはなっている
		return grid;
	}

	private genPuzzle(minPerBlock = 2, minPerStack = 8): SudokuGrid {
		const game: SudokuGrid = this.solution.map((row) => [...row]); // 深いコピー
		const perBlock = Array(9).fill(9); // それぞれの 3×3 block に、今「表示されている（消されていない）マスの数」。最初は全部9
		const perStack = Array(3).fill(27); // それぞれの縦スタックに、今「表示されている（消されていない）マスの数」。 最初は全部27

		const tryRemove = (row: number, col: number) => {
			if (!game[row][col]) return; // 既に空

			const b = Math.floor(row / 3) * 3 + Math.floor(col / 3); // 0..8; 3x3 block
			const s = Math.floor(col / 3); // 0..2; 縦スタック

			// 下限を割らないか事前チェック
			if (perBlock[b] - 1 < minPerBlock || perStack[s] - 1 < minPerStack) return;

			const keep = game[row][col];
			game[row][col] = 0 as SudokuNum; // 仮に消して一意性を確認
			perBlock[b]--; // 仮に消したのでカウントを減らす
			perStack[s]--;
			if (this.countSolutions(game) !== 1) {
				game[row][col] = keep; // 仮に消したのを戻す
				perBlock[b]++; // 仮に消したのを戻したのでカウントも戻す
				perStack[s]++;
			}
		};

		const cells: [number, number][] = [];
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				cells.push([row, col]);
			}
		}
		this.shuffle(cells); // 候補セルをランダム順で列挙
		for (const [row, col] of cells) tryRemove(row, col);

		return game;
	}

	public updateInputs({ row, col }: CellIndex, num: SudokuNum | 0): void {
		if (row === undefined || col === undefined) return;
		const newRow = [...this.inputs[row]]; // 浅いコピーで新しい行配列を生成
		newRow[col] = num; // 新しい行配列内の要素を更新
		const newInputs = [...this.inputs]; // 浅いコピーで新しいグリッド全体を生成
		newInputs[row] = newRow; // 新しいグリッドに新しい行をセット
		this.inputs = newInputs;
	}

	public resetInputs(): void {
		this.inputs = gen2d(9, 9, 0);
	}

	public checkInputs(): boolean[][] {
		const check = gen2d<boolean>(9, 9, false);
		this.puzzle.forEach((row, r) => {
			row.forEach((num, c) => {
				if (num !== 0) return; // 固定セルは無視する
				if (this.inputs[r][c] === 0) return; // 空セルは無視する
				check[r][c] = this.inputs[r][c] === this.solution[r][c]; // ユーザーの入力が解答と一致する場合のみ true を返す
			});
		});
		return check;
	}

	public checkWin(): boolean {
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (this.puzzle[r][c] !== 0) continue; // 元々の問題の数字は無視
				if (this.inputs[r][c] === 0) return false; // 盤面が完成しているかチェック
				if (this.inputs[r][c] !== this.solution[r][c]) return false; // 盤面が正しいかチェック
			}
		}
		return true; // 全部一致する場合のみ true を返す
	}

	private shuffle<T>(a: T[]): T[] {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a; // Fisher–Yates
	}

	private isValid(grid: SudokuGrid, row: number, col: number, num: SudokuNum): boolean {
		for (let i = 0; i < 9; i++) {
			if (grid[row][i] === num || grid[i][col] === num) return false;
		} // 同じ行または列に同じ数字がないか

		const sRow = Math.floor(row / 3) * 3;
		const sCol = Math.floor(col / 3) * 3;
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				if (grid[sRow + row][sCol + col] === num) return false;
			}
		} // 3×3 block 内に同じ数字がないか

		return true;
	}

	private countSolutions(grid: SudokuGrid): number {
		let [eRow, eCol] = [-1, -1];
		loop: for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				// 空セル (=0) を見つけたら
				if (!grid[row][col]) {
					[eRow, eCol] = [row, col];
					break loop; // ラベル付きループ内のネストで break, continue を使用するとラベルにジャンプできる
				}
			}
		}
		if (eRow === -1) return 1; // 空きなし = 解を1つ発見

		const used = Array(10).fill(false); // boolean[10] にするのは 1..9 をそのままインデックスにしたいから; 0番目は使わない。
		for (let i = 0; i < 9; i++) {
			used[grid[eRow][i]] = true;
			used[grid[i][eCol]] = true;
		} // 同じ行と列で使われている数字を集計

		const sRow = Math.floor(eRow / 3) * 3;
		const sCol = Math.floor(eCol / 3) * 3;
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				used[grid[sRow + row][sCol + col]] = true;
			}
		} // 3×3 block 内で使われている数字を集計

		let count = 0;
		const order: SudokuNum[] = [];
		for (let n = 1 as SudokuNum; n <= 9; n++) if (!used[n]) order.push(n);
		this.shuffle(order);
		for (const num of order) {
			if (this.isValid(grid, eRow, eCol, num)) {
				grid[eRow][eCol] = num;
				count += this.countSolutions(grid);
				grid[eRow][eCol] = 0 as SudokuNum; // バックトラックで必ず戻す
				if (count >= 2) break; // 一意性判定：解が2つ見つかったら打ち切り = 一意でない
			}
		}

		return count;
	}
}
