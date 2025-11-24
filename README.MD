# XML-TO-DANFE-DACTE
This is an API for generating the "Documento Auxiliar da Nota Fiscal Eletrônica" (DANFE) or the "Documento Auxiliar do Conhecimento de Transporte Eletrônico" (DACTE) from the XML file of the Nota Fiscal Eletrônica (NFe) or Conhecimento de Transporte Eletrônico (CTe).

# Prerequisites
You need Bun.js runtime installed on your machine. This project won't work with Node.js.
To install Bun.js, follow the instructions on the [official website](https://bun.sh/).

# Quick Start
```
git clone https://github.com/DenisBessa/xml_to_danfe_dacte.git
cd xml_to_danfe_dacte
bun install
bun dev
```

# Use example
```
curl --location 'http://localhost:3000' \
--header 'Content-Type: text/plain' \
--data-raw '<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"> { ... } </nfeProc>'
```

Replace the `{ ... }` with the XML content. It should be a valid XML file of the NFe or CTe.

## CORS – configurando domínios permitidos por variável de ambiente

Os domínios permitidos para CORS podem ser configurados via variáveis de ambiente. Por padrão, se nenhuma variável for definida, os seguintes domínios são permitidos:

- `https://lovable.dev`
- `https://nferiza.app.lmsis.com.br`
- `https://id-preview--fe732262-5d89-40d7-8962-a6ba74a3dc36.lovable.app`

Você pode sobrescrever essa lista definindo uma das variáveis a seguir (a primeira com valor será utilizada):

- `ALLOWED_ORIGINS`
- `CORS_ALLOWED_ORIGINS`

Formato aceito: lista separada por vírgulas, espaços ou quebras de linha. Exemplos de valores válidos:

```
https://a.com, https://b.com
```

```
https://a.com https://b.com https://c.com
```

```
https://a.com
https://b.com
https://c.com
```

### Executando localmente com Bun (PowerShell)

```
$env:ALLOWED_ORIGINS = "https://a.com, https://b.com"; bun run index.ts
```

CMD (Prompt de Comando):

```
set ALLOWED_ORIGINS=https://a.com, https://b.com && bun run index.ts
```

### Docker

Em tempo de execução (recomendado):

```
docker run --rm -p 3000:3000 -e ALLOWED_ORIGINS="https://a.com, https://b.com" ghcr.io/seu-usuario/xml_to_danfe_dacte:latest
```

Também é possível informar no build (opcional):

```
docker build --build-arg ALLOWED_ORIGINS="https://a.com, https://b.com" -t xml_to_danfe_dacte .
```

Ao iniciar, a aplicação registra no console a lista efetiva de origens permitidas.