import { Question } from './types';

export const introText = "Para eu estruturar uma proposta coerente, modular e alinhada ao estágio real da operação, preciso primeiro entender a base do negócio, o que já existe e o que vocês esperam de mim. Onde ainda não houver definição, podem marcar ‘quero sua recomendação’.";

export const questions: Question[] = [
  {
    id: 1,
    title: "Qual é o objetivo principal desta operação nos próximos 6 a 12 meses?",
    options: [
      "Validar produto e mercado",
      "Gerar as primeiras vendas com operação funcional",
      "Estruturar a base comercial digital",
      "Construir marca e presença",
      "Desenvolver B2C e B2B em paralelo",
      "Quero sua recomendação"
    ],
    rationale: "Por que estou perguntando isso:\nPorque sem um objetivo principal claro, o projeto tende a misturar validação, branding, vendas e estruturação ao mesmo tempo. Isso afeta diretamente o desenho do funil, a ordem de implantação e o nível de investimento necessário.",
    type: "single"
  },
  {
    id: 2,
    title: "Qual é a prioridade principal neste momento?",
    options: [
      "Velocidade de lançamento",
      "Baixo custo inicial",
      "Construir a base corretamente",
      "Testar mercado com risco controlado",
      "Gerar receita o mais rápido possível",
      "Quero sua recomendação"
    ],
    rationale: "Por que estou perguntando isso:\nPorque toda operação nova precisa escolher o que otimizar primeiro. Não dá para priorizar ao mesmo tempo velocidade, baixo custo, profundidade estrutural e performance imediata sem gerar conflito no projeto.",
    type: "single"
  },
  {
    id: 3,
    title: "Que produto será vendido e em qual faixa de preço ele se encaixa?",
    groups: [
      {
        label: "Produto",
        options: [
          "Produto físico de consumo recorrente",
          "Produto físico de compra ocasional",
          "Produto premium / maior valor agregado",
          "Linha enxuta para testar mercado",
          "Ainda em definição"
        ]
      },
      {
        label: "Faixa de preço",
        options: [
          "Até € 30",
          "Entre € 30 e € 100",
          "Entre € 100 e € 300",
          "Acima de € 300",
          "Ainda não definido"
        ]
      }
    ],
    rationale: "Por que estou perguntando isso:\nPorque tipo de produto e faixa de preço mudam completamente a lógica do funil, o nível de objeção, a necessidade de prova, o volume de criativos, o esforço de conversão e o tipo de jornada comercial.",
    type: "composite"
  },
  {
    id: 4,
    title: "O catálogo inicial será de qual tamanho?",
    options: [
      "1 a 3 produtos",
      "4 a 10 produtos",
      "10+ produtos",
      "Ainda não definido"
    ],
    rationale: "Por que estou perguntando isso:\nPorque a complexidade de um funil, da comunicação e da operação muda bastante quando estamos falando de um produto principal versus um catálogo com várias linhas e mensagens comerciais diferentes.",
    type: "single"
  },
  {
    id: 5,
    title: "O modelo da operação hoje se aproxima mais de qual formato?",
    options: [
      "Revenda com fornecedor local",
      "White label com marca própria",
      "Operação enxuta com lógica próxima de drop shipping",
      "Híbrido entre white label e distribuição",
      "Ainda preciso alinhar isso melhor"
    ],
    rationale: "Por que estou perguntando isso:\nPorque o modelo operacional define margem, controle sobre a oferta, posicionamento, nível de dependência de terceiros e grau de sofisticação necessário na estrutura comercial digital.",
    type: "single"
  },
  {
    id: 6,
    title: "O foco inicial da operação será mais B2C, mais B2B ou híbrido desde o início?",
    options: [
      "Mais B2C",
      "Mais B2B",
      "Híbrido desde o início",
      "Começar por um e depois expandir",
      "Quero sua recomendação"
    ],
    rationale: "Por que estou perguntando isso:\nPorque B2C e B2B exigem jornadas, linguagem, canais, prazos e mecanismos de conversão diferentes. Se isso não estiver claro, o risco é tentar construir duas operações ao mesmo tempo sem foco suficiente.",
    type: "single"
  },
  {
    id: 7,
    title: "Qual é o diferencial competitivo que vocês enxergam hoje nessa operação?",
    options: [
      "Preço",
      "Qualidade do produto",
      "Marca e posicionamento",
      "Curadoria / seleção",
      "Agilidade / conveniência",
      "Relacionamento / atendimento",
      "Ainda não está claro"
    ],
    rationale: "Por que estou perguntando isso:\nPorque funil sem proposta de valor clara vira apenas distribuição de tráfego. Antes de vender, é preciso entender qual argumento comercial realmente sustenta a conversão.",
    type: "single"
  },
  {
    id: 8,
    title: "O que já existe hoje de forma concreta na operação?",
    options: [
      "Só ideia e fornecedor",
      "Nome e marca definidos",
      "Identidade visual inicial",
      "Catálogo básico",
      "Site/e-commerce em construção",
      "CRM ou ferramenta comercial",
      "Materiais criativos prontos",
      "Nada estruturado ainda"
    ],
    rationale: "Por que estou perguntando isso:\nPorque eu preciso separar o que já está resolvido do que ainda depende de construção. Isso impacta diretamente o escopo, o cronograma e o custo da estruturação.",
    type: "multiple"
  },
  {
    id: 9,
    title: "Já existe algum histórico de vendas, validação ou teste de mercado?",
    options: [
      "Não, operação nova do zero",
      "Sim, já houve vendas em canal informal",
      "Sim, já houve vendas em outra operação/paralela",
      "Sim, mas ainda sem dados organizados",
      "Ainda não houve validação real"
    ],
    rationale: "Por que estou perguntando isso:\nPorque validar do zero é uma realidade. Escalar algo que já teve alguma resposta do mercado é outra. O risco estratégico e o peso do seu trabalho mudam muito entre esses dois cenários.",
    type: "single"
  },
  {
    id: 10,
    title: "Como vocês imaginam adquirir os primeiros clientes?",
    options: [
      "Principalmente tráfego pago",
      "Conteúdo orgânico",
      "Influenciadores/parcerias",
      "Networking / relacionamento",
      "Marketplace",
      "B2B via prospecção ativa",
      "Modelo misto",
      "Quero sua recomendação"
    ],
    rationale: "Por que estou perguntando isso:\nPorque a origem da demanda define o tipo de funil, a necessidade de automação, o nível de apoio comercial, o volume de criativos e a velocidade possível de implementação.",
    type: "multiple"
  },
  {
    id: 11,
    title: "Quem vai assumir comercial, atendimento e follow-up no dia a dia?",
    options: [
      "O próprio Daniel",
      "Um sócio / founder da operação",
      "Equipe interna",
      "Comercial terceirizado",
      "Ainda indefinido"
    ],
    rationale: "Por que estou perguntando isso:\nPorque eu posso estruturar a operação digital, mas o resultado final depende de quem executa a resposta comercial, o atendimento e a continuidade do relacionamento. Se isso estiver indefinido, o risco do projeto sobe.",
    type: "single"
  },
  {
    id: 12,
    title: "A logística, entrega e pós-venda já estão resolvidos?",
    options: [
      "Sim, já estão definidos",
      "Parcialmente resolvidos",
      "Ainda em definição",
      "Dependem do volume inicial",
      "Quero alinhar isso melhor"
    ],
    rationale: "Por que estou perguntando isso:\nPorque um funil pode gerar demanda, mas se a operação não sustenta entrega e experiência, o crescimento vira problema em vez de avanço. Isso também afeta o grau de responsabilidade que faz sentido atribuir ao marketing e ao funil.",
    type: "single"
  },
  {
    id: 13,
    title: "A marca já possui direção clara de comunicação e ativos criativos prontos?",
    options: [
      "Sim, já existe tom de voz e identidade visual consistente",
      "Existe parcialmente",
      "Só existe identidade visual inicial",
      "Há fotos e peças básicas",
      "Há vídeos e materiais comerciais",
      "Ainda precisa ser construído praticamente do zero"
    ],
    rationale: "Por que estou perguntando isso:\nPorque uma operação comercial digital não depende só de estratégia e automação. Ela depende também de linguagem, coerência visual e materiais de conversão. Se isso não existir, o escopo aumenta bastante.",
    type: "single"
  },
  {
    id: 14,
    title: "Em relação à parte criativa e de comunicação, o que vocês esperam do meu papel?",
    options: [
      "Apenas direção estratégica",
      "Direção + supervisão da execução",
      "Direção + execução parcial",
      "Gestão de parceiros/freelancers",
      "Produção pontual sob demanda",
      "Quero sua recomendação"
    ],
    rationale: "Por que estou perguntando isso:\nPorque produção criativa não pode ficar implícita dentro de “gestão de funil”. Aqui precisamos distinguir com clareza o que é estratégia, o que é direção e o que é execução, para o escopo não crescer sem alinhamento nem remuneração correspondente.",
    type: "single"
  },
  {
    id: 15,
    title: "O que vocês esperam objetivamente do meu trabalho nesta fase 1?",
    options: [
      "Diagnóstico e arquitetura da operação comercial digital",
      "Desenho e implantação do funil",
      "Organização de CRM e automações",
      "Direcionamento da comunicação e ativos de conversão",
      "Acompanhamento e otimização após implantação",
      "Estruturação modular com evolução por etapas",
      "Combinação de mais de um item acima"
    ],
    rationale: "Por que estou perguntando isso:\nPorque “precisamos de um Funnel Builder” pode significar coisas muito diferentes. Eu preciso entender se a expectativa é consultiva, estrutural, operacional ou híbrida, para propor algo proporcional ao trabalho real.",
    type: "single"
  },
  {
    id: 16,
    title: "Qual é o budget atual, o prazo desejado e o formato de contratação que vocês imaginam?",
    groups: [
      {
        label: "Budget",
        options: [
          "Muito enxuto",
          "Enxuto, mas viável para uma fase 1",
          "Moderado",
          "Variável conforme a operação avance",
          "Prefiro alinhar isso diretamente"
        ]
      },
      {
        label: "Prazo",
        options: [
          "Até 30 dias",
          "30 a 60 dias",
          "60 a 90 dias",
          "Sem prazo rígido, desde que bem estruturado"
        ]
      },
      {
        label: "Formato",
        options: [
          "Projeto inicial de estruturação",
          "Estruturação + acompanhamento mensal",
          "Implantação modular por fases",
          "Quero sua recomendação"
        ]
      }
    ],
    rationale: "Por que estou perguntando isso:\nPorque orçamento, prazo e formato de contratação são o que transformam diagnóstico em proposta realista. Sem isso, qualquer proposta corre o risco de estar certa tecnicamente e errada comercialmente.",
    type: "composite"
  }
];
