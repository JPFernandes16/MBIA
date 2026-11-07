# RESPONSABILIDADE E LICITUDE NO TRATAMENTO DE DADOS

## 1\. Mapeamento e Alocação de Responsabilidade

A estrutura de conformidade exige a identificação clara dos papéis, que determinam quem responde legalmente perante o titular e a autoridade de controlo.

* **Responsável pelo Tratamento:** Determina as finalidades e os meios.  
* **Subcontratante:** Atua estritamente mediante instruções do responsável.  
* **Encarregado de Proteção de Dados (EPD):** Tem uma função de aconselhamento e auditoria, mas a responsabilidade legal final pela execução e manutenção do sistema pertence à **administração da organização**.  
* **Avaliação de Impacto (AIPD):** A sua obrigatoriedade deve ser validada cruzando os critérios gerais com a lista nacional de tratamentos de risco da CNPD (Regulamento n.º 798/2018).

## 2\. Requisitos dos Fundamentos de Licitude

O tratamento de dados requer uma base legal documentada antes do seu início.

| Fundamento de Licitude | Requisitos e Limitações Jurídicas |
| :---- | :---- |
| **Consentimento** | Tem de ser livre e específico. **Regra de exclusão:** Condicionar a prestação de um serviço (ex: uso de uma aplicação) à aceitação obrigatória de envio de publicidade compromete a liberdade, tornando o consentimento **inválido**. |
| **Interesse Legítimo** | Exige **três verificações cumulativas**: 1\. Interesse real é lícito; 2\. Necessidade (inexistência de alternativa menos intrusiva); 3\. Ponderação documentada de direitos. **Exceção absoluta:** Não se aplica a autoridades públicas no exercício das suas funções oficiais. |
| **Contexto Laboral** | Devido ao desequilíbrio de poderes, o consentimento do trabalhador é, por norma, **inválido**. O tratamento deve basear-se na execução do contrato, obrigação legal ou interesse legítimo. |

---

# FRONTEIRAS TÉCNICAS: DADOS PÚBLICOS, INFERÊNCIAS E IA

## 1\. Recolha na Internet e Dados Públicos

A acessibilidade técnica de uma informação não elimina a proteção jurídica do titular.

* **Acesso e *Scraping*:** A visibilidade pública de um perfil ou registo **não constitui autorização geral** para a recolha, cruzamento ou reutilização de dados. A extração automatizada exige base legal, minimização e cumprimento do dever de informação.  
* **Categorias Especiais (Exceção de Publicidade):** O tratamento de dados sensíveis recolhidos publicamente só é lícito (ao abrigo do art. 9.º, n.º 2, al. e) se a informação tiver sido **manifestamente tornada pública pelo próprio titular**. Se a publicação foi feita por um terceiro, a exceção **não se aplica**.

## 2\. Inteligência Artificial, Perfis e Estatística

A transformação de dados através de algoritmos gera novas implicações jurídicas.

* **Inferências como Dados Pessoais:** Uma etiqueta gerada por *Machine Learning* (ex: probabilidade de cancelamento ou padrão de consumo) constitui um dado pessoal. Se a previsão estatística falhar, o titular pode exercer o **direito à retificação** da dedução errada.  
* **Risco de Cruzamento:** O cruzamento de dados triviais (compras, localizações) que revele indiretamente dados sensíveis (saúde, orientação sexual) fica **imediatamente sujeito à proibição geral** de tratamento de categorias especiais.  
* **Desmistificação de Anonimato:** Um modelo de IA treinado com dados pessoais **não é automaticamente anónimo** se for possível reidentificar ou reconstruir os dados por engenharia inversa. A pseudonimização é apenas uma medida de segurança, não tornando os dados anónimos (pois a chave de identificação subsiste).  
* **Estatística vs. Decisão:** Classificar um projeto como "estatístico" não afasta as regras gerais se o resultado for utilizado para apoiar decisões sobre pessoas determinadas (ex: preços individuais).

---

# DIREITOS DOS TITULARES: PRAZOS E OBRIGAÇÕES CONSEQUENTES

* **Prazos de Resposta e Custos:** A resposta a pedidos de exercício de direitos deve ocorrer **no prazo de um mês** (prorrogável por mais dois mediante justificação). O exercício é **gratuito**; a cobrança de taxas (ex: 25 euros) só é lícita se o responsável provar que o pedido é **manifestamente infundado ou excessivo**.  
* **Conservação e Apagamento:** Os dados não podem ser mantidos por tempo indeterminado. Terminado o prazo ou critério necessário à finalidade, devem ser **apagados ou efetivamente anonimizados**, salvo retenção estritamente necessária para obrigações legais ou defesa em juízo.  
* **Dever de Comunicação em Cadeia:** O responsável tem a obrigação legal de comunicar aos destinatários (a quem transmitiu os dados) as retificações ou apagamentos realizados, exigindo um mapa de partilhas rigoroso. **Exceção:** Dispensa-se se a comunicação for impossível ou exigir um esforço desproporcionado.

---

# REGULAMENTO DOS DADOS (DATA ACT) VS. RGPD

O Regulamento (UE) 2023/2854 (Data Act) regula o acesso e a utilização equitativa de dados (sobretudo de dispositivos IoT e produtos conectados), articulando-se com o RGPD sem o substituir\[cite: 132, 139\].

## 1\. Delimitação de Conceitos e Conflitos de Leis

| Variável | Regime RGPD (Proteção de Dados Pessoais) | Regime Data Act (Acesso e Partilha) |
| :---- | :---- | :---- |
| **Objeto** | Exclusivamente dados pessoais. | Dados **pessoais e não pessoais**. |
| **Sujeito Protegido** | Titular dos dados (exclusivamente **pessoa singular**). | Utilizador do produto (pode ser **pessoa singular ou coletiva**). |
| **Prevalência** | Lei especial de direitos fundamentais. | **Em caso de conflito, prevalece o RGPD**. O acesso ao abrigo do Data Act não cria autorização geral para tratamento de dados pessoais. |

2\. Direitos de Acesso, Partilha e Limitações

* **Acesso e Partilha:** O utilizador tem direito a aceder prontamente aos dados do produto conectado e pedir a sua disponibilização a terceiros.  
* **Bloqueio de Dados de Terceiros:** Se o equipamento gerar dados pessoais de outras pessoas (ex: dados de saúde de estudantes numa universidade que comprou os dispositivos), a universidade (utilizadora) **não tem livre acesso automático**, necessitando de base legal e condição do art. 9.º do RGPD para os aceder legitimamente.  
* **Exceções de Partilha:** Os controladores de acesso (Gatekeepers do Regulamento dos Mercados Digitais) **não são terceiros elegíveis** para receber dados a pedido do utilizador\[cite: 135\].

## 3\. Prazos de Aplicação e Relações Contratuais (Data Act)

* **12 de setembro de 2025:** Início da aplicação geral do Data Act.  
* **12 de setembro de 2026:** Obrigatoriedade de **acesso aos dados por conceção** (acesso por defeito, fácil, seguro e gratuito) para novos produtos colocados no mercado.  
* **12 de janeiro de 2027:** Fim total da cobrança de encargos para **mudança de prestador de serviços de tratamento de dados** (mudança de *cloud*).  
* **Proteção B2B (Empresa para Empresa):** O Data Act invalida cláusulas abusivas relativas a dados impostas unilateralmente (ex: cláusulas que excluam responsabilidade por dolo ou negligência grosseira).  
* **Acesso Público (B2G):** Organismos públicos só podem exigir dados empresariais em casos de **necessidade excecional** (emergências públicas), não constituindo um direito geral de acesso, e com preferência absoluta por dados não pessoais.

&nbsp;