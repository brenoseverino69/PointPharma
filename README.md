# PointPharma --- Aplicativo Mobile

Aplicativo mobile desenvolvido com **React Native**, **Expo** e
**TypeScript** para consultar farmácias e produtos, visualizar ofertas e
gerenciar um carrinho de compras.

## Tecnologias

-   React Native e Expo
-   TypeScript
-   Expo Router
-   Axios
-   Context API

## Funcionalidades

-   Listagem de farmácias.
-   Visualização dos detalhes de cada farmácia.
-   Listagem de produtos vinculados à farmácia selecionada.
-   Exibição de preços e ofertas.
-   Adição e remoção de produtos no carrinho.
-   Cálculo automático do subtotal e total dos itens.

## Estrutura principal

``` text
src/
├── app/
│   ├── home.tsx
│   ├── cart.tsx
│   └── pharmacy/
│       └── [id].tsx
├── components/
│   └── ProductCard.tsx
├── context/
│   └── CartContext.tsx
├── data/
│   └── types.ts
└── services/
    ├── api.ts
    ├── farmacias.ts
    └── produtos.ts
```

## Requisitos

-   Node.js e npm.
-   Expo Go ou emulador Android/iOS.
-   Backend PointPharma em execução e acessível pela rede.

## Instalação e execução

Na pasta do projeto, execute:

``` bash
npm install
npx expo start
```

Leia o QR Code com o Expo Go ou inicie a aplicação em um emulador.

## Configuração da API

O arquivo `src/services/api.ts` utiliza atualmente:

``` ts
const api = axios.create({
    baseURL: 'http://10.139.75.47:5000/api',
    timeout: 10000
});
```

O IP deve ser o IPv4 do computador que está executando o backend. Para
testar em um celular físico, computador e celular precisam estar na
mesma rede Wi-Fi. Não use `localhost` no celular para acessar o backend
do computador.

Se o IP mudar, atualize o `baseURL` em `src/services/api.ts`.

## Executar o backend

Na pasta do projeto ASP.NET Core, execute:

``` bash
dotnet run --urls "http://0.0.0.0:5000"
```

Swagger: `http://localhost:5000/swagger`

## Endpoints utilizados

  ---------------------------------------------------------------------------------------
  Método                  Rota                                    Finalidade
  ----------------------- --------------------------------------- -----------------------
  GET                     `/api/Farmacias`                        Lista as farmácias

  GET                     `/api/Farmacias/{id}`                   Busca uma farmácia pelo
                                                                  ID

  GET                     `/api/Produtos`                         Lista os produtos

  GET                     `/api/Produtos/Farmacia/{farmaciaId}`   Lista produtos de uma
                                                                  farmácia
  ---------------------------------------------------------------------------------------

## Observações

-   Os produtos de cada farmácia são carregados pela API.
-   O carrinho compartilha os itens entre as telas por meio do contexto
    da aplicação.
-   O backend precisa estar ligado e acessível para carregar os dados.

## Projeto

**PointPharma** --- Aplicativo mobile para consulta de farmácias e
produtos.
