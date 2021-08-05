## DB の操作がうまくいくかのテスト（まずローカルでコマンド叩いて、そのあと Express からやってみる）

### やりたいこと

- テーブル定義
- データ挿入（それぞれ）
  - session_name にかぶりがないかチェックする
- パスワードでの認証する
- 認証後、session_name で user_name と payment の対を取得する

```
create table session_master(
  session_name  char(32)  not null,
  pass_hash     char(64)  not null,
  create_date   date      not null,
  primary key (session_name)
);
```

```
create table users(
  session_name  char(32)  not null,
  user_name     char(32)  not null,
  user_payment  int       not null,
  primary key (session_name)
);
```

```
insert into session_master
  (session_name, pass_hash, create_date)
  values ('test_session3', 'password', now());
```

```
insert into users
  (session_name, user_name, user_payment)
  values ('test_session', '割勘太郎', '1000');
```
