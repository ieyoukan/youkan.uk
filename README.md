ようかんのおうち

## 開発環境

[mise](https://mise.jdx.dev/) を導入し、このディレクトリで `mise install` を実行すると、必要な Node.js と pnpm がインストールされます。

```sh
mise install
mise exec -- pnpm install
mise exec -- pnpm dev
```

PowerShell で `pnpm` を直接実行するには、`$PROFILE` に以下を追加してターミナルを開き直します。

```powershell
(&mise activate pwsh) | Out-String | Invoke-Expression
```

mise をシェルに有効化している場合は、`mise exec --` を省略できます。
