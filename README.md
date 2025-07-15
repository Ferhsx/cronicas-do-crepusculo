# Crônicas do Crepúsculo Eterno

Este é um projeto de uma ficha de personagem interativa e um guia de referência para o sistema de RPG de mesa "Crônicas do Crepúsculo Eterno", um sistema de fantasia medieval focado em one-shots. A aplicação é construída com React, TypeScript e Tailwind CSS.

**Acesse a versão ao vivo aqui:** [https://Ferhsx.github.io/cronicas-do-crepusculo/](https://Ferhsx.github.io/cronicas-do-crepusculo/)


---

## Funcionalidades

*   **Ficha Interativa:** Crie e gerencie sua ficha de personagem, com cálculos automáticos de atributos.
*   **Criação Guiada:** Sistema de criação de personagem passo a passo com distribuição de pontos.
*   **Rolador de Dados:** Ferramenta integrada para rolar testes de atributos, ataques e defesas.
*   **Compartilhamento de Ficha:** Gere um link único para compartilhar sua ficha com o mestre e outros jogadores.
*   **Guia de Referência Rápido:** Seções com as regras principais, lore do mundo e arquétipos disponíveis.
*   **Salvamento Local:** Sua ficha é salva automaticamente no navegador.

## Tecnologias Utilizadas

*   **Frontend:** [React](https://reactjs.org/) com [TypeScript](https://www.typescriptlang.org/)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Compressão de Dados:** [lz-string](https://github.com/pieroxy/lz-string) para o compartilhamento de fichas.
*   **Deploy:** [GitHub Pages](https://pages.github.com/) com [GitHub Actions](https://github.com/features/actions).

## Como Rodar o Projeto Localmente

Para executar este projeto em sua máquina local, siga os passos abaixo:

1.  **Clone o repositório:**
    ```sh
    git clone https://github.com/ferhsx/cronicas-do-crepusculo.git
    cd cronicas-do-crepusculo
    ```

2.  **Instale as dependências:**
    (Você precisa ter o [Node.js](https://nodejs.org/) instalado)
    ```sh
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```sh
    npm run dev
    ```

4.  Abra seu navegador e acesse `http://localhost:5173` (ou o endereço indicado no seu terminal).

## Processo de Deploy

O deploy é feito automaticamente via GitHub Actions. Qualquer `push` para a branch `main` irá acionar o workflow definido em `.github/workflows/deploy.yml`, que irá compilar a aplicação e publicá-la no GitHub Pages.