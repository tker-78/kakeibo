# 実装中に得た知見のメモ

## Pinia + supabase authでのルートガードの実装

Piniaは状態監視に使われる機能で、
認証に関わる操作を行うたびに、Piniaの変数を上書きすることで、
色々な処理(例えばページ遷移時のルートガードの実装)などに活用できる。

基本的な実装手順は下記の通り。

1. PiniaのAuthStoreを`stores/auth.ts`に定義する。
2. `main.ts`でPiniaを使う設定を行う。
3. `App.vue`で、authStoreの初期化処理を追加する(onMountedとして)
4. 各コンポーネントのメソッドを、authStoreのメソッドに書き換える。(これで状態管理が有効になる)
5. `router/index.ts`にルートガードを実装する。(beforeEachメソッド内に、ルートガードの定義を記述する。)