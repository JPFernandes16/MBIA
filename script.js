/**
 * PLATAFORMA LMS — DIREITO NO CIBERESPAÇO (MBIA)
 * Motor Lógico SPA, Gestão Multimédia, Persistência Local e Avaliação Automática
 */

document.addEventListener('DOMContentLoaded', inicializarAplicacao);

// Estado Global da Aplicação
const estadoApp = {
    aulaAtual: '1',
    modoMedia: 'ambos',
    mostrarDicas: false,
    dadosTestes: {
        escolha_multipla: [],
        desenvolvimento: []
    }
};

// Mapa de Títulos para os Breadcrumbs Institucionais
const mapaBreadcrumbs = {
    'view-dashboard': 'Painel da Disciplina',
    'view-recursos': 'Sala de Estudo (PDF & Vídeo)',
    'view-teste-em': 'Exame: Escolha Múltipla (20 Questões)',
    'view-teste-aberto': 'Exame: Desenvolvimento (4 Questões)',
    'view-fuc': 'Ficha da UC & Bibliografia'
};

// Prefixo de armazenamento isolado no navegador do estudante
const STORAGE_PREFIX = 'mbia_dc_';

/* ==========================================================================
   1. INICIALIZAÇÃO E EVENTOS GLOBAIS DA INTERFACE
   ========================================================================== */
async function inicializarAplicacao() {
    configurarNavegacaoSPA();
    configurarMenuLateralMobile();
    configurarBlocoApontamentos();
    configurarFormulariosAvaliacao();

    // Definir grelha lado a lado por defeito em ecrãs de computador
    const workspace = document.getElementById('media-workspace');
    if (workspace) {
        workspace.classList.add('modo-ambos');
    }

    // Carregar apontamentos da Aula 1 e métricas guardadas no dispositivo
    carregarApontamentosAula(estadoApp.aulaAtual);
    atualizarKPIsDashboard();

    // Carregar base de dados de perguntas (testes.json)
    await carregarDadosJSON();
}

function configurarNavegacaoSPA() {
    const botoesMenu = document.querySelectorAll('.nav-item, .mob-nav-btn');
    botoesMenu.forEach(botao => {
        botao.addEventListener('click', () => {
            const vistaAlvo = botao.getAttribute('data-target');
            if (vistaAlvo) {
                mudarVista(vistaAlvo);
            }
        });
    });
}

function mudarVista(idVista) {
    // 1. Ocultar todas as secções e ativar apenas a vista selecionada
    document.querySelectorAll('.lms-view').forEach(vista => {
        vista.classList.add('oculto');
        vista.classList.remove('ativo');
    });

    const secAlvo = document.getElementById(idVista);
    if (secAlvo) {
        secAlvo.classList.remove('oculto');
        secAlvo.classList.add('ativo');
    }

    // 2. Sincronizar estado ativo nos botões laterais (Desktop/Tablet) e inferiores (iPhone)
    document.querySelectorAll('.nav-item, .mob-nav-btn').forEach(btn => {
        if (btn.getAttribute('data-target') === idVista) {
            btn.classList.add('ativo');
        } else {
            btn.classList.remove('ativo');
        }
    });

    // 3. Atualizar Breadcrumb institucional
    const elBreadcrumb = document.getElementById('breadcrumb-atual');
    if (elBreadcrumb && mapaBreadcrumbs[idVista]) {
        elBreadcrumb.textContent = mapaBreadcrumbs[idVista];
    }

    // 4. Fechar menu gaveta se estiver aberto em modo mobile/tablet
    fecharMenuMobile();

    // 5. Pausar o vídeo automaticamente se o estudante sair da sala de aula
    if (idVista !== 'view-recursos') {
        const videoElement = document.getElementById('frame-video');
        if (videoElement && !videoElement.paused) {
            videoElement.pause();
        }
    }

    // 6. Repor scroll no topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function configurarMenuLateralMobile() {
    const btnToggle = document.getElementById('btn-toggle-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (btnToggle) {
        btnToggle.addEventListener('click', () => {
            const sidebar = document.getElementById('lms-sidebar');
            sidebar.classList.toggle('aberto');
            overlay.classList.toggle('ativo');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', fecharMenuMobile);
    }
}

function fecharMenuMobile() {
    const sidebar = document.getElementById('lms-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('aberto');
    if (overlay) overlay.classList.remove('ativo');
}

/* ==========================================================================
   2. GESTÃO DA SALA DE AULA (PDF, VÍDEO E APONTAMENTOS POR AULA)
   ========================================================================== */
function abrirAulaDireta(numeroAula, modoPreferencial = null) {
    const seletor = document.getElementById('seletor-aula');
    if (seletor) {
        seletor.value = String(numeroAula);
    }

    mudarVista('view-recursos');
    carregarMaterialAula();

    // Em ecrãs móveis ou quando clicado num botão específico do Dashboard, focar no meio pretendido
    if (modoPreferencial) {
        alternarModoMedia(modoPreferencial);
    } else if (window.innerWidth < 768) {
        alternarModoMedia('pdf');
    } else {
        alternarModoMedia('ambos');
    }
}

function carregarMaterialAula() {
    const seletor = document.getElementById('seletor-aula');
    if (!seletor) return;

    const numAula = seletor.value;
    estadoApp.aulaAtual = numAula;

    const caminhoPDF = `aulas/aula${numAula}.pdf`;
    const caminhoVideo = `aulas/aula${numAula}.mp4`;

    // Atualizar componente PDF
    const framePDF = document.getElementById('frame-pdf');
    const labelPDF = document.getElementById('nome-ficheiro-pdf');
    const linkPDF = document.getElementById('link-abrir-pdf');

    if (framePDF) framePDF.src = caminhoPDF;
    if (labelPDF) labelPDF.textContent = caminhoPDF;
    if (linkPDF) linkPDF.href = caminhoPDF;

    // Atualizar componente Vídeo
    const frameVideo = document.getElementById('frame-video');
    const sourceVideo = document.getElementById('source-video');
    const labelVideo = document.getElementById('nome-ficheiro-video');

    if (sourceVideo) sourceVideo.src = caminhoVideo;
    if (labelVideo) labelVideo.textContent = caminhoVideo;
    if (frameVideo) frameVideo.load();

    // Carregar os apontamentos específicos desta aula guardados localmente
    carregarApontamentosAula(numAula);
}

function alternarModoMedia(modo) {
    estadoApp.modoMedia = modo;

    const workspace = document.getElementById('media-workspace');
    const painelPDF = document.getElementById('painel-pdf');
    const painelVideo = document.getElementById('painel-video');
    const botoesModo = document.querySelectorAll('.mode-btn');

    // Atualizar estado visual dos botões de alternância
    botoesModo.forEach(btn => {
        const texto = btn.textContent.toLowerCase();
        const corresponde =
            (modo === 'ambos' && texto.includes('ambos')) ||
            (modo === 'pdf' && texto.includes('pdf')) ||
            (modo === 'video' && texto.includes('vídeo'));
        btn.classList.toggle('ativo', corresponde);
    });

    if (!workspace || !painelPDF || !painelVideo) return;

    if (modo === 'ambos') {
        workspace.classList.add('modo-ambos');
        painelPDF.classList.remove('oculto');
        painelVideo.classList.remove('oculto');
    } else if (modo === 'pdf') {
        workspace.classList.remove('modo-ambos');
        painelPDF.classList.remove('oculto');
        painelVideo.classList.add('oculto');
    } else if (modo === 'video') {
        workspace.classList.remove('modo-ambos');
        painelPDF.classList.add('oculto');
        painelVideo.classList.remove('oculto');
    }
}

function configurarBlocoApontamentos() {
    const campoNotas = document.getElementById('notas-aula');
    const indicador = document.getElementById('status-notas');
    if (!campoNotas) return;

    campoNotas.addEventListener('input', () => {
        const chave = `${STORAGE_PREFIX}notas_aula_${estadoApp.aulaAtual}`;
        localStorage.setItem(chave, campoNotas.value);

        if (indicador) {
            const hora = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
            indicador.textContent = `Guardado automaticamente às ${hora}`;
        }
    });
}

function carregarApontamentosAula(numAula) {
    const campoNotas = document.getElementById('notas-aula');
    const indicador = document.getElementById('status-notas');
    if (!campoNotas) return;

    const chave = `${STORAGE_PREFIX}notas_aula_${numAula}`;
    campoNotas.value = localStorage.getItem(chave) || '';

    if (indicador) {
        indicador.textContent = `Apontamentos da Aula ${numAula} sincronizados localmente`;
    }
}

/* ==========================================================================
   3. CARREGAMENTO E RENDERIZAÇÃO DO MODELO DE DADOS (testes.json)
   ========================================================================== */
async function carregarDadosJSON() {
    try {
        const resposta = await fetch('testes.json', { cache: 'no-store' });
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        const dados = await resposta.json();
        estadoApp.dadosTestes = dados;

        renderizarEscolhaMultipla(dados.escolha_multipla || []);
        renderizarDesenvolvimento(dados.desenvolvimento || []);
    } catch (erro) {
        console.error('Erro ao carregar testes.json:', erro);
        apresentarAvisoCarregamento();
    }
}

function apresentarAvisoCarregamento() {
    const containerEM = document.getElementById('contentor-escolha-multipla');
    const containerDev = document.getElementById('contentor-desenvolvimento');
    const mensagemHTML = `
        <div class="pergunta-bloco">
            <p class="pergunta-enunciado">Não foi possível carregar o ficheiro <code>testes.json</code>.</p>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">
                Certifique-se de que o ficheiro <strong>testes.json</strong> tem uma estrutura JSON válida e de que está a abrir o projeto através do GitHub Pages ou da extensão <em>Live Server</em> do VS Code (os navegadores bloqueiam pedidos <code>fetch</code> quando abertos diretamente com duplo clique via protocolo <code>file://</code>).
            </p>
        </div>
    `;
    if (containerEM) containerEM.innerHTML = mensagemHTML;
    if (containerDev) containerDev.innerHTML = mensagemHTML;
}

/* ==========================================================================
   4. MÓDULO DE EXAME: 20 QUESTÕES DE ESCOLHA MÚLTIPLA
   ========================================================================== */
function renderizarEscolhaMultipla(listaQuestoes) {
    const containerEM = document.getElementById('contentor-escolha-multipla');
    const grelhaNav = document.getElementById('grelha-navegacao-em');
    if (!containerEM || !grelhaNav) return;

    containerEM.innerHTML = '';
    grelhaNav.innerHTML = '';

    const total = listaQuestoes.length;
    const cotacaoUnitaria = total > 0 ? (20 / total).toFixed(1) : '1.0';

    listaQuestoes.forEach((questao, idx) => {
        const numero = idx + 1;
        const idBloco = `questao-em-${questao.id}`;

        // 1. Construir opções de resposta
        let opcoesHTML = '';
        questao.opcoes.forEach((textoOpcao, opcaoIdx) => {
            const letra = String.fromCharCode(65 + opcaoIdx); // A, B, C, D...
            opcoesHTML += `
                <label class="opcao-item" id="label-em-${questao.id}-${opcaoIdx}">
                    <input type="radio" name="em_${questao.id}" value="${opcaoIdx}" data-qid="${questao.id}">
                    <span><strong>${letra})</strong> ${textoOpcao}</span>
                </label>
            `;
        });

        // 2. Inserir Cartão da Questão
        const artigo = document.createElement('article');
        artigo.className = 'pergunta-bloco';
        artigo.id = idBloco;
        artigo.innerHTML = `
            <div class="pergunta-cabecalho">
                <span class="pergunta-numero">Questão ${numero}</span>
                <span class="pergunta-cotacao">Cotação: ${cotacaoUnitaria} val.</span>
            </div>
            <p class="pergunta-enunciado">${questao.pergunta}</p>
            <div class="opcoes-lista">
                ${opcoesHTML}
            </div>
            <div id="explicacao-em-${questao.id}" class="oculto" style="margin-top: 0.75rem; font-size: 0.85rem;"></div>
        `;
        containerEM.appendChild(artigo);

        // 3. Criar botão correspondente na Paleta Lateral do Moodle (1 a 20)
        const btnPaleta = document.createElement('button');
        btnPaleta.type = 'button';
        btnPaleta.className = 'palette-btn';
        btnPaleta.id = `paleta-btn-${questao.id}`;
        btnPaleta.textContent = numero;
        btnPaleta.addEventListener('click', () => {
            document.getElementById(idBloco).scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        grelhaNav.appendChild(btnPaleta);
    });

    // Monitorizar seleção de respostas em tempo real para atualizar a paleta lateral
    containerEM.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const qid = e.target.getAttribute('data-qid');
            const btnPaleta = document.getElementById(`paleta-btn-${qid}`);
            if (btnPaleta) {
                btnPaleta.classList.add('respondida');
            }
            atualizarProgressoEM();
        });
    });

    atualizarProgressoEM();
}

function atualizarProgressoEM() {
    const lista = estadoApp.dadosTestes.escolha_multipla || [];
    const total = lista.length;
    let respondidas = 0;

    lista.forEach(q => {
        const selecionada = document.querySelector(`input[name="em_${q.id}"]:checked`);
        if (selecionada) respondidas++;
    });

    const contador = document.getElementById('contador-respondidas-em');
    if (contador) {
        contador.textContent = `${respondidas} / ${total}`;
    }
}

function corrigirEscolhaMultipla(evento) {
    evento.preventDefault();

    const lista = estadoApp.dadosTestes.escolha_multipla || [];
    if (lista.length === 0) return;

    let certas = 0;

    lista.forEach(q => {
        const inputSelecionado = document.querySelector(`input[name="em_${q.id}"]:checked`);
        const valorSelecionado = inputSelecionado ? parseInt(inputSelecionado.value, 10) : null;
        const btnPaleta = document.getElementById(`paleta-btn-${q.id}`);

        // Limpar classes de correção anteriores
        q.opcoes.forEach((_, idx) => {
            const label = document.getElementById(`label-em-${q.id}-${idx}`);
            if (label) label.classList.remove('correta', 'incorreta');
        });
        if (btnPaleta) btnPaleta.classList.remove('correta', 'incorreta');

        // Destacar sempre a opção correta a verde
        const labelCorreta = document.getElementById(`label-em-${q.id}-${q.resposta_correta}`);
        if (labelCorreta) labelCorreta.classList.add('correta');

        // Verificar se o estudante acertou ou falhou
        if (valorSelecionado === q.resposta_correta) {
            certas++;
            if (btnPaleta) btnPaleta.classList.add('correta');
        } else {
            if (valorSelecionado !== null) {
                const labelErrada = document.getElementById(`label-em-${q.id}-${valorSelecionado}`);
                if (labelErrada) labelErrada.classList.add('incorreta');
            }
            if (btnPaleta) btnPaleta.classList.add('incorreta');
        }

        // Mostrar fundamentação jurídica, caso exista no JSON (campo opcional "justificacao")
        const divExplicacao = document.getElementById(`explicacao-em-${q.id}`);
        if (divExplicacao && q.justificacao) {
            divExplicacao.classList.remove('oculto');
            divExplicacao.innerHTML = `<strong>Fundamentação:</strong> ${q.justificacao}`;
        }
    });

    const total = lista.length;
    const percentagem = Math.round((certas / total) * 100);
    const notaEscala20 = ((certas / total) * 20).toFixed(1);

    // Guardar estatística no dispositivo e atualizar Dashboard
    localStorage.setItem(`${STORAGE_PREFIX}ultimo_score_em`, `${certas}/${total} (${notaEscala20} val.)`);
    atualizarKPIsDashboard();

    // Apresentar sumário final da prova
    const painelResultados = document.getElementById('resultados-em');
    if (painelResultados) {
        painelResultados.classList.remove('oculto');
        painelResultados.innerHTML = `
            <h3>Resultado da Simulação: ${notaEscala20} / 20 valores (${percentagem}%)</h3>
            <p>Acertou <strong>${certas}</strong> em <strong>${total}</strong> questões de escolha múltipla. Verifique no enunciado acima e na grelha lateral as respostas assinaladas a verde (corretas) e a vermelho (incorretas).</p>
        `;
        painelResultados.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function reiniciarTesteEM() {
    const form = document.getElementById('form-em');
    if (form) form.reset();

    document.querySelectorAll('.opcao-item').forEach(el => {
        el.classList.remove('correta', 'incorreta');
    });

    document.querySelectorAll('.palette-btn').forEach(btn => {
        btn.classList.remove('respondida', 'correta', 'incorreta');
    });

    document.querySelectorAll('[id^="explicacao-em-"]').forEach(div => {
        div.classList.add('oculto');
    });

    const painelResultados = document.getElementById('resultados-em');
    if (painelResultados) {
        painelResultados.classList.add('oculto');
        painelResultados.innerHTML = '';
    }

    atualizarProgressoEM();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   5. MÓDULO DE EXAME: 4 QUESTÕES DE DESENVOLVIMENTO (VALIDAÇÃO LEXICAL)
   ========================================================================== */
function renderizarDesenvolvimento(listaQuestoes) {
    const containerDev = document.getElementById('contentor-desenvolvimento');
    if (!containerDev) return;

    containerDev.innerHTML = '';

    listaQuestoes.forEach((questao, idx) => {
        const numero = idx + 1;
        const chaveRascunho = `${STORAGE_PREFIX}rascunho_dev_${questao.id}`;
        const textoGuardado = localStorage.getItem(chaveRascunho) || '';
        const listaPalavras = (questao.palavras_chave || []).join(' • ');

        const artigo = document.createElement('article');
        artigo.className = 'pergunta-bloco';
        artigo.innerHTML = `
            <div class="pergunta-cabecalho">
                <span class="pergunta-numero">Questão de Desenvolvimento ${numero}</span>
                <span class="pergunta-cotacao"> Validação por Conceitos-Chave</span>
            </div>
            <p class="pergunta-enunciado">${questao.pergunta}</p>
            <div class="dica-palavras-chave oculto" id="dica-dev-${questao.id}">
                <strong>Termos jurídicos esperados (${questao.palavras_chave.length}):</strong> ${listaPalavras}
            </div>
            <textarea
                id="dev_${questao.id}"
                class="textarea-desenvolvimento"
                data-qid="${questao.id}"
                placeholder="Redija aqui a sua resposta fundamentada..."
            >${textoGuardado}</textarea>
            <div id="feedback_dev_${questao.id}" class="oculto"></div>
        `;
        containerDev.appendChild(artigo);
    });

    // Gravar rascunho em tempo real para proteger o texto em dispositivos móveis
    containerDev.querySelectorAll('.textarea-desenvolvimento').forEach(textarea => {
        textarea.addEventListener('input', (e) => {
            const qid = e.target.getAttribute('data-qid');
            localStorage.setItem(`${STORAGE_PREFIX}rascunho_dev_${qid}`, e.target.value);
        });
    });
}

/**
 * Normaliza texto removendo acentos e convertendo para minúsculas,
 * permitindo validar conceitos jurídicos mesmo que digitados rapidamente no telemóvel.
 */
function normalizarTextoLexical(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function validarQuestoesDesenvolvimento(evento) {
    evento.preventDefault();

    const lista = estadoApp.dadosTestes.desenvolvimento || [];
    if (lista.length === 0) return;

    let questoesDominadas = 0;

    lista.forEach(q => {
        const campoTexto = document.getElementById(`dev_${q.id}`);
        const divFeedback = document.getElementById(`feedback_dev_${q.id}`);
        if (!campoTexto || !divFeedback) return;

        const respostaNormalizada = normalizarTextoLexical(campoTexto.value);
        const encontradas = [];
        const emFalta = [];

        (q.palavras_chave || []).forEach(termoOriginal => {
            const termoNormalizado = normalizarTextoLexical(termoOriginal);
            if (respostaNormalizada.includes(termoNormalizado)) {
                encontradas.push(termoOriginal);
            } else {
                emFalta.push(termoOriginal);
            }
        });

        // Gerar etiquetas visuais (Badges Verdes e Vermelhas)
        const badgesHTML = [
            ...encontradas.map(t => `<span class="kw-badge encontrada">✓ ${t}</span>`),
            ...emFalta.map(t => `<span class="kw-badge falta">✗ ${t}</span>`)
        ].join('');

        divFeedback.classList.remove('oculto');

        if (emFalta.length === 0 && q.palavras_chave.length > 0) {
            questoesDominadas++;
            divFeedback.className = 'feedback-palavra-chave';
            divFeedback.innerHTML = `
                <strong>Excelente rigor conceptual (${encontradas.length}/${q.palavras_chave.length} termos integrados).</strong>
                <div class="kw-badges-container">${badgesHTML}</div>
            `;
        } else {
            divFeedback.className = 'feedback-palavra-chave falha';
            divFeedback.innerHTML = `
                <strong>Cobertura parcial: incluiu ${encontradas.length} de ${q.palavras_chave.length} conceitos-chave.</strong>
                <p style="margin-top: 0.25rem;">Reveja a sua resposta para incorporar os termos a vermelho:</p>
                <div class="kw-badges-container">${badgesHTML}</div>
            `;
        }
    });

    // Atualizar KPI no localStorage e no Dashboard
    localStorage.setItem(`${STORAGE_PREFIX}ultimo_score_dev`, `${questoesDominadas} / ${lista.length} validadas`);
    atualizarKPIsDashboard();

    const painelResultadosDev = document.getElementById('resultados-dev');
    if (painelResultadosDev) {
        painelResultadosDev.classList.remove('oculto');
        painelResultadosDev.innerHTML = `
            <h3>Análise Lexical Concluída: ${questoesDominadas} de ${lista.length} questões com 100% dos conceitos-chave</h3>
            <p>As suas respostas estão guardadas localmente neste dispositivo. Pode ajustar o texto acima e voltar a validar até integrar todos os termos técnicos.</p>
        `;
    }
}

function mostrarDicasPalavrasChave() {
    estadoApp.mostrarDicas = !estadoApp.mostrarDicas;
    document.querySelectorAll('.dica-palavras-chave').forEach(div => {
        div.classList.toggle('oculto', !estadoApp.mostrarDicas);
    });
}

/* ==========================================================================
   6. LIGAÇÃO DE FORMULÁRIOS E ATUALIZAÇÃO DE MÉTRICAS DO DASHBOARD
   ========================================================================== */
function configurarFormulariosAvaliacao() {
    const formEM = document.getElementById('form-em');
    const formDev = document.getElementById('form-dev');

    if (formEM) {
        formEM.addEventListener('submit', corrigirEscolhaMultipla);
    }

    if (formDev) {
        formDev.addEventListener('submit', validarQuestoesDesenvolvimento);
    }
}

function atualizarKPIsDashboard() {
    const kpiEM = document.getElementById('kpi-score-em');
    const kpiDev = document.getElementById('kpi-score-dev');

    const scoreEMGuardado = localStorage.getItem(`${STORAGE_PREFIX}ultimo_score_em`);
    const scoreDevGuardado = localStorage.getItem(`${STORAGE_PREFIX}ultimo_score_dev`);

    if (kpiEM && scoreEMGuardado) {
        kpiEM.textContent = scoreEMGuardado;
    }

    if (kpiDev && scoreDevGuardado) {
        kpiDev.textContent = scoreDevGuardado;
    }
}