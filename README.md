<div align="center">
  <h1>Crônicas do Crepúsculo Eterno</h1>
  <p>Um sistema de RPG de mesa de fantasia sombria com foco em narrativa e conflitos pessoais</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/Ferhsx/cronicas-do-crepusculo)
  [![Deploy](https://img.shields.io/badge/🌐-Acesse%20a%20versão%20online-9cf)](https://Ferhsx.github.io/cronicas-do-crepusculo/)

  <img src="https://via.placeholder.com/1200x400/1a202c/e2e8f0?text=Crônicas+do+Crepúsculo" alt="Banner do Projeto" width="100%"/>
</div>

## 🌟 Visão Geral

Crônicas do Crepúsculo é um sistema de RPG de mesa que se passa em um mundo de fantasia sombria, onde os personagens são definidos por suas Chamas interiores e devem lidar com as tensões entre quatro grandes facções. Este projeto oferece uma ficha de personagem digital interativa e um guia de referência completo para o sistema.

### ⚡ Funcionalidades Principais

- **🎭 Criação de Personagem Completa**
  - Sistema de 5 Chamas (Força, Agilidade, Intelecto, Carisma e Mistério)
  - Múltiplos arquétipos e origens personalizáveis
  - Sistema de inventário e equipamentos detalhado
  - Gerenciamento de Ecos (habilidades especiais)

- **🎲 Ferramentas de Jogo**
  - Rolador de dados integrado com cálculos automáticos
  - Sistema de Penumbra e tensão dinâmica
  - Gerenciamento de influência entre as facções
  - Compartilhamento de fichas entre jogadores

- **📚 Referência de Regras**
  - Guia completo de regras do sistema
  - Descrições detalhadas de arquétipos e origens
  - Catálogo de itens e equipamentos
  - Sistema de resolução de conflitos

## 🚀 Tecnologias Utilizadas

- **Frontend:** [React](https://reactjs.org/) com [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Gerenciamento de Estado:** React Hooks & Context API
- **Persistência:** Armazenamento local do navegador
- **Compressão de Dados:** [lz-string](https://github.com/pieroxy/lz-string)
- **Hospedagem:** [GitHub Pages](https://pages.github.com/) com [GitHub Actions](https://github.com/features/actions)

## 🛠️ Como Executar Localmente

1. **Pré-requisitos**
   - Node.js (versão 16 ou superior)
   - npm ou yarn

2. **Clonar o repositório**
   ```bash
   git clone https://github.com/Ferhsx/cronicas-do-crepusculo.git
   cd cronicas-do-crepusculo
   ```

3. **Instalar dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

4. **Iniciar servidor de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acessar a aplicação**
   Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## 🎮 Sistema de Jogo

### As 5 Chamas
Cada personagem é definido por 5 atributos principais chamados Chamas:

- **Chama de Ferro** (🔴): Força física e resistência
- **Chama de Prata** (⚪): Agilidade e destreza
- **Chama de Ouro** (🟡): Intelecto e sabedoria
- **Chama de Jade** (🟢): Carisma e manipulação social
- **Chama de Rubi** (🔴): Conexão com o sobrenatural

### Facções em Conflito
O mundo é moldado pelo conflito entre quatro grandes facções:

- **Crepusculares**: Guardiões da ordem e tradição
- **Eternos**: Buscadores da imortalidade e poder
- **Brumas**: Mestres dos segredos e mistérios
- **Alvorecer**: Agentes da mudança e revolução

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis da UI
├── pages/         # Páginas da aplicação
│   ├── CharacterSheet/  # Página da ficha do personagem
│   ├── Lore/           # Página de lore do mundo
│   ├── Rules/          # Página de regras
│   └── ...
├── service/       # Serviços e integrações
├── types/         # Definições de tipos TypeScript
├── App.tsx        # Componente raiz
├── constants.ts   # Constantes do jogo
└── index.tsx      # Ponto de entrada
```

## 🤝 Como Contribuir

Contribuições são bem-vindas! Siga estes passos:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça o push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## ✨ Agradecimentos

- A todos os jogadores e mestres que testaram e contribuíram com feedback
- À comunidade brasileira de RPG por toda a inspiração
- Aos desenvolvedores das tecnologias incríveis que tornaram este projeto possível

---

Desenvolvido com ❤️ por [Fernando Xavier](https://github.com/Ferhsx) |  [GitHub](https://github.com/Ferhsx)

## Processo de Deploy

O deploy é feito automaticamente via GitHub Actions. Qualquer `push` para a branch `main` irá acionar o workflow definido em `.github/workflows/deploy.yml`, que irá compilar a aplicação e publicá-la no GitHub Pages.
