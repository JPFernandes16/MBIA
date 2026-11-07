# CONTRATAÇÃO ELETRÓNICA E CONTRATOS À DISTÂNCIA

## 1\. Delimitação de Conceitos: Meio vs. Modo

A tipificação do contrato varia em função da tecnologia ou da presença física das partes.

| Conceito Jurídico | Fator Distintivo e Aplicação |
| :---- | :---- |
| **Contrato Eletrônico** | Define-se pelo **meio técnico** utilizado (suporte digital ou informático). Aplica-se a negócios comerciais e não comerciais. |
| **Contrato à Distância** | Define-se pelo **modo de celebração**, consubstanciado na ausência de presença física simultânea das partes. |

2\. Liberdade de Celebração, Vinculação e Exceções

A lei consagra o princípio da liberdade de celebração por via eletrónica, não prejudicando a validade do negócio pelo uso deste meio.

* **Exclusões Absolutas à Via Eletrónica (Art. 25.º, DL 7/2004):** Estão excluídos os negócios familiares e sucessórios, atos dependentes de intervenção notarial/pública, negócios reais imobiliários (**exceto arrendamento**) e certas cauções/garantias prestadas fora da atividade profissional.  
* **Proibição Impositiva:** É estritamente proibido o uso de cláusulas contratuais gerais que imponham unilateralmente a celebração eletrónica aos consumidores.  
* **Momento de Vinculação:** A declaração vinculativa ocorre no momento da ação final que confirma a vontade (ex: clicar no botão final). O envio do "aviso de receção" não determina o momento da conclusão do contrato.  
* **Obrigação de Pagamento:** Nos contratos à distância, o botão de finalização tem de ser inequívoco (ex: "encomenda com obrigação de pagar" ou "comprar e pagar"). Termos ambíguos como "Continuar" invalidam o cumprimento da obrigação de informação.

---

# DOCUMENTO ELETRÓNICO E ASSINATURAS

## 1\. Força Probatória e Requisitos Escritos

* **Requisito de Forma:** O documento eletrónico (texto, som ou imagem) satisfaz a exigência legal de forma escrita **sempre que o seu conteúdo seja representável como declaração escrita**.  
* **Limitação de Autenticidade:** A aposição de uma assinatura eletrónica qualificada a um documento particular **não o transforma num documento autêntico**. O documento mantém a natureza particular, embora beneficie de presunções de autoria.

## 2\. Tipologias de Assinatura Eletrónica (Regulamento eIDAS)

O efeito jurídico e a segurança probatória dependem do nível técnico da assinatura.

| Nível de Assinatura | Requisitos Técnicos | Efeito Jurídico |
| :---- | :---- | :---- |
| **Eletrónica (Simples)** | Dados em formato eletrónico. | Não pode ser recusada como prova apenas por ser eletrónica.. Valor apreciado livremente. |
| **Avançada** | Ligação única ao signatário; controlo exclusivo dos dados de criação; permite a deteção de alterações posteriores ao conteúdo. | Maior fiabilidade técnica, mas não é automaticamente equiparada à assinatura manuscrita. |
| **Qualificada** | Assinatura avançada criada por um **dispositivo qualificado** e baseada num **certificado qualificado**. | **Equivale à assinatura autógrafa (manuscrita)**. Gera presunção legal de autoria e integridade. |

> **Detalhe Técnico Nacional:** A **Chave Móvel Digital (CMD)** em Portugal permite produzir uma assinatura eletrónica qualificada (desde que o certificado esteja ativo), garantindo exatamente a mesma validade que uma assinatura manuscrita.

---

# AUTOMATIZAÇÃO DA VONTADE E IMPUGNAÇÃO

A legislação admite a contratação integralmente conduzida por computadores, sem intervenção humana\[cite: 177\]. Os erros gerados por sistemas automatizados enquadram-se nas seguintes categorias civis:

1. **Erro de Programação:** Tratado como erro na formação da vontade.  
2. **Defeito da Máquina:** Configura um erro na declaração.  
3. **Mensagem Deformada:** Configura um erro na transmissão.  
* **Regra de Oponibilidade:** A contraparte **não pode opor-se** à impugnação do contrato por erro se, face às circunstâncias, **lhe era exigível aperceber-se do mesmo** (ex: *pricing* flagrantemente desfasado do mercado por erro de software).

---

# FATURAÇÃO, FISCALIDADE E PROVA DE PAGAMENTO

## 1\. Dissecação de Documentos Transacionais

O ato de *checkout* pode gerar documentos distintos, com efeitos jurídicos e fiscais independentes.

| Documento | Função Jurídico-Fiscal | Característica Excludente |
| :---- | :---- | :---- |
| **Fatura** | Função Fiscal (Código do IVA). | Documenta a operação, taxa aplicável e motivo de isenção. Possui numeração sequencial e ATCUD. |
| **Recibo** | Prova de Quitação. | Prova o recebimento pecuniário. Pode ser integrado na fatura (fatura-recibo). |
| **Comprovativo** | Prova Bancária. | **Não substitui a fatura**. Apenas demonstra a execução no sistema de pagamentos. |

2\. Emissão e Regras da Fatura Eletrónica

* **Prazos Estritos:** A fatura deve ser emitida até ao **5.º dia útil** seguinte ao facto gerador. Em caso de pagamentos antecipados, deve ser emitida **na data exata do recebimento**.  
* **Aceitação do Destinatário:** A validade legal da fatura eletrónica (em detrimento da física) depende da **aceitação** pelo destinatário. Esta pode ser expressa (contrato/adesão) ou tácita (comportamento concludente do cliente).  
* **Formatos:** Pode ser apresentada como PDF (se emitida e recebida eletronicamente) ou em dados estruturados (ex: XML, obrigatório na contratação pública). É imperativo garantir autenticidade, integridade e legibilidade por 10 anos.

---

# SEGURANÇA NOS PAGAMENTOS (SCA) E RESPONSABILIDADE

## 1\. Autenticação Forte do Cliente (SCA)

Para iniciar um pagamento ou aceder à conta online, a lei obriga à aplicação da Autenticação Forte (SCA).

* **Requisito de Fatores Cumulativos (2FA):** Exige-se a combinação de, no mínimo, dois elementos independentes: **Conhecimento** (ex: PIN/Password), **Posse** (ex: Telemóvel) ou **Inerência** (ex: Biometria).  
* **Requisito de Ligação Dinâmica:** O código gerado para validar a transação remota tem de estar indissociavelmente ligado de forma dinâmica ao **valor exato** e à **identidade do beneficiário**, bloqueando adulterações intermédias.  
* **Exceções à Regra SCA:** O prestador pode isentar a operação por ser de baixo valor, pagamento recorrente ou beneficiário de confiança, mas **assume integralmente o risco operacional** da fraude.

## 2\. Repartição de Responsabilidade e Correção Financeira

Em caso de operações não autorizadas (fraude):

* **Dever do Utilizador:** Notificar o prestador sem atraso injustificado após a deteção.  
* **Ónus do Prestador:** Provar a efetiva autenticação e a ausência de falha técnica. O mero registo informático não é prova suficiente de que a operação foi licitamente autorizada pelo titular.  
* **Reembolso:** O prestador está obrigado a reembolsar, salvo se demonstrar negligência grave, fraude do utilizador ou perda de instrumento não comunicada.

## 3\. Classificação de Devoluções Pecuniárias

* **Reembolso:** Devolução do comerciante ao consumidor fundamentada em lei de consumo (livre resolução, defeito).  
* **Estorno:** Correção/anulação puramente técnica de uma operação bancária provocada por erro ou duplicação indevida de débito.  
* **Chargeback:** Contestação bancária na rede do cartão (ex: VISA), sujeita a regras da rede privada, não substituindo o direito do consumidor.

&nbsp;