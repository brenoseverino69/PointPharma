# PointPharma 💊

App de farmácias em React Native + TypeScript (Expo Router).

## Como rodar
```bash
npm install
npx expo install --fix   # alinha as versões das libs com o SDK do Expo
npx expo start
```
Abra com o **Expo Go** (QR Code) ou pressione `a` (Android) / `i` (iOS).

## Estrutura
```
src/
  app/          rotas (Expo Router): index (login), register, home, cart, checkout, pharmacy/[id]
  components/   Button, Input, Header, SearchBar, ProductCard
  context/      AuthContext, CartContext
  data/         types.ts e mock.ts (farmácias e produtos de exemplo)
  theme.ts      cores, fontes e formatação de moeda
```
Import com alias: `@/components/Button`, `@/theme`, etc.
