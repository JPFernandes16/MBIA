/**
 * PLATAFORMA LMS — DIREITO NO CIBERESPAÇO (MBIA)
 * Motor Lógico SPA, Renderizador Markdown (Aula01..07), Sorteio Invisível (10+8+2) e Avaliação Cega
 */

document.addEventListener('DOMContentLoaded', inicializarAplicacao);

// Estado Global da Aplicação
const estadoApp = {
    aulaAtual: '1',
    modoMedia: 'ambos',
    mostrarDicas: false,
    repertorioEM: [],
    dadosTestes: {
        escolha_multipla: [],
        desenvolvimento: []
    }
};

// Mapa de Títulos para os Breadcrumbs Institucionais
const mapaBreadcrumbs = {
    'view-dashboard': 'Painel da Disciplina',
    'view-recursos': 'Sala de Estudo',
    'view-teste-em': 'Exame: Escolha Múltipla',
    'view-teste-aberto': 'Exame: Desenvolvimento',
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

    const workspace = document.getElementById('media-workspace');
    if (workspace) {
        workspace.classList.add('modo-ambos');
    }

    await carregarMaterialAula();
    atualizarKPIsDashboard();
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
    document.querySelectorAll('.lms-view').forEach(vista => {
        vista.classList.add('oculto');
        vista.classList.remove('ativo');
    });

    const secAlvo = document.getElementById(idVista);
    if (secAlvo) {
        secAlvo.classList.remove('oculto');
        secAlvo.classList.add('ativo');
    }

    document.querySelectorAll('.nav-item, .mob-nav-btn').forEach(btn => {
        if (btn.getAttribute('data-target') === idVista) {
            btn.classList.add('ativo');
        } else {
            btn.classList.remove('ativo');
        }
    });

    const elBreadcrumb = document.getElementById('breadcrumb-atual');
    if (elBreadcrumb && mapaBreadcrumbs[idVista]) {
        elBreadcrumb.textContent = mapaBreadcrumbs[idVista];
    }

    fecharMenuMobile();

    if (idVista !== 'view-recursos') {
        const videoElement = document.getElementById('frame-video');
        if (videoElement && !videoElement.paused) {
            videoElement.pause();
        }
    }

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
   2. GESTÃO DA SALA DE AULA (MARKDOWN Aula01..07, VÍDEO E APONTAMENTOS)
   ========================================================================== */
function formatarCodigoAula(numero) {
    return String(numero).padStart(2, '0');
}

function abrirAulaDireta(numeroAula, modoPreferencial = null) {
    const seletor = document.getElementById('seletor-aula');
    if (seletor) {
        seletor.value = String(numeroAula);
    }

    mudarVista('view-recursos');
    carregarMaterialAula();

    if (modoPreferencial) {
        alternarModoMedia(modoPreferencial);
    } else if (window.innerWidth < 768) {
        alternarModoMedia('md');
    } else {
        alternarModoMedia('ambos');
    }
}

async function carregarMaterialAula() {
    const seletor = document.getElementById('seletor-aula');
    if (!seletor) return;

    const numAula = seletor.value;
    estadoApp.aulaAtual = numAula;

    const codigo = formatarCodigoAula(numAula);
    const caminhoMD = `aulas/Aula${codigo}.md`;
    const caminhoVideo = `aulas/Aula${codigo}.mp4`;

    const labelMD = document.getElementById('nome-ficheiro-md');
    const linkMD = document.getElementById('link-abrir-md');
    if (labelMD) labelMD.textContent = caminhoMD;
    if (linkMD) linkMD.href = caminhoMD;

    const frameVideo = document.getElementById('frame-video');
    const sourceVideo = document.getElementById('source-video');
    const labelVideo = document.getElementById('nome-ficheiro-video');

    if (sourceVideo) sourceVideo.src = caminhoVideo;
    if (labelVideo) labelVideo.textContent = caminhoVideo;
    if (frameVideo) frameVideo.load();

    carregarApontamentosAula(numAula);
    await renderizarFicheiroMarkdown(caminhoMD);
}

async function renderizarFicheiroMarkdown(caminhoMD) {
    const contentorMD = document.getElementById('leitor-markdown');
    if (!contentorMD) return;

    contentorMD.innerHTML = `<p style="color: var(--text-muted);">A carregar <code>${caminhoMD}</code>...</p>`;

    try {
        const resposta = await fetch(caminhoMD, { cache: 'no-store' });
        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}`);
        }
        const textoMarkdown = await resposta.text();

        if (typeof marked !== 'undefined') {
            contentorMD.innerHTML = marked.parse(textoMarkdown);
        } else {
            contentorMD.innerHTML = `<pre>${textoMarkdown}</pre>`;
        }
        contentorMD.scrollTop = 0;
    } catch (erro) {
        console.error('Erro ao ler ficheiro Markdown:', erro);
        contentorMD.innerHTML = `
            <div style="padding: 1rem; background: var(--status-warning-bg); border-left: 4px solid var(--status-warning); border-radius: 4px;">
                <strong>Não foi possível carregar <code>${caminhoMD}</code>.</strong>
                <p style="margin-top: 0.4rem; font-size: 0.88rem;">
                    Verifique se o ficheiro existe na pasta <code>aulas/</code> com o nome exato <strong>${caminhoMD.split('/').pop()}</strong>.
                </p>
            </div>
        `;
    }
}

function alternarModoMedia(modo) {
    const modoNormalizado = modo === 'pdf' ? 'md' : modo;
    estadoApp.modoMedia = modoNormalizado;

    const workspace = document.getElementById('media-workspace');
    const painelMD = document.getElementById('painel-md');
    const painelVideo = document.getElementById('painel-video');
    const botoesModo = document.querySelectorAll('.mode-btn');

    botoesModo.forEach(btn => {
        const btnModo = btn.getAttribute('data-modo');
        btn.classList.toggle('ativo', btnModo === modoNormalizado);
    });

    if (!workspace || !painelMD || !painelVideo) return;

    if (modoNormalizado === 'ambos') {
        workspace.classList.add('modo-ambos');
        painelMD.classList.remove('oculto');
        painelVideo.classList.remove('oculto');
    } else if (modoNormalizado === 'md') {
        workspace.classList.remove('modo-ambos');
        painelMD.classList.remove('oculto');
        painelVideo.classList.add('oculto');
    } else if (modoNormalizado === 'video') {
        workspace.classList.remove('modo-ambos');
        painelMD.classList.add('oculto');
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
        indicador.textContent = `Apontamentos da Aula ${formatarCodigoAula(numAula)} sincronizados localmente`;
    }
}

/* ==========================================================================
   3. CARREGAMENTO E SORTEIO INVISÍVEL (10 FÁCEIS + 8 INTERMÉDIAS + 2 DIFÍCEIS)
   ========================================================================== */
async function carregarDadosJSON() {
    try {
        const resposta = await fetch('testes.json', { cache: 'no-store' });
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        const dados = await resposta.json();

        estadoApp.repertorioEM = dados.escolha_multipla || [];
        estadoApp.dadosTestes.desenvolvimento = dados.desenvolvimento || [];

        gerarNovoExameSorteado();
        renderizarDesenvolvimento(estadoApp.dadosTestes.desenvolvimento);
    } catch (erro) {
        console.error('Erro ao carregar testes.json:', erro);
        apresentarAvisoCarregamento();
    }
}

function baralharArray(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function gerarNovoExameSorteado() {
    const repertorio = estadoApp.repertorioEM || [];

    const faceis = baralharArray(repertorio.filter(q => q.dificuldade === 'facil')).slice(0, 10);
    const intermedias = baralharArray(repertorio.filter(q => q.dificuldade === 'intermedia')).slice(0, 8);
    const dificeis = baralharArray(repertorio.filter(q => q.dificuldade === 'dificil')).slice(0, 2);

    let exameSorteado = [...faceis, ...intermedias, ...dificeis];
    if (exameSorteado.length === 0 && repertorio.length > 0) {
        exameSorteado = baralharArray(repertorio).slice(0, 20);
    } else {
        // Baralha a ordem das 20 questões sorteadas para não ficarem agrupadas por dificuldade
        exameSorteado = baralharArray(exameSorteado);
    }

    estadoApp.dadosTestes.escolha_multipla = exameSorteado;
    renderizarEscolhaMultipla(exameSorteado);
}

function apresentarAvisoCarregamento() {
    const containerEM = document.getElementById('contentor-escolha-multipla');
    const containerDev = document.getElementById('contentor-desenvolvimento');
    const mensagemHTML = `
        <div class="pergunta-bloco">
            <p class="pergunta-enunciado">Não foi possível carregar o ficheiro <code>testes.json</code>.</p>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">
                Certifique-se de que o ficheiro <strong>testes.json</strong> tem uma estrutura JSON válida e de que está a abrir o projeto através do GitHub Pages ou da extensão <em>Live Server</em> do VS Code.
            </p>
        </div>
    `;
    if (containerEM) containerEM.innerHTML = mensagemHTML;
    if (containerDev) containerDev.innerHTML = mensagemHTML;
}

/* ==========================================================================
   4. MÓDULO DE EXAME: ESCOLHA MÚLTIPLA (INTERFACE LIMPA E CEGA)
   ========================================================================== */
function obterArrayRespostasCorretas(respostaCorreta) {
    return Array.isArray(respostaCorreta) ? respostaCorreta : [respostaCorreta];
}

function renderizarEscolhaMultipla(listaQuestoes) {
    const containerEM = document.getElementById('contentor-escolha-multipla');
    const grelhaNav = document.getElementById('grelha-navegacao-em');
    const spanTotal = document.getElementById('titulo-total-em');
    if (!containerEM || !grelhaNav) return;

    containerEM.innerHTML = '';
    grelhaNav.innerHTML = '';

    const total = listaQuestoes.length;
    if (spanTotal) {
        spanTotal.textContent = total;
    }
    const cotacaoUnitaria = total > 0 ? (20 / total).toFixed(2) : '1.00';

    listaQuestoes.forEach((questao, idx) => {
        const numero = idx + 1;
        const idBloco = `questao-em-${questao.id}`;

        // Remove qualquer eventual etiqueta entre parênteses retos [Aula X...] caso exista
        const enunciadoLimpo = questao.pergunta.replace(/^\[.*?\]\s*/, '');

        // Todas as opções usam checkbox uniforme para não denunciar quantas estão corretas
        let opcoesHTML = '';
        questao.opcoes.forEach((textoOpcao, opcaoIdx) => {
            const letra = String.fromCharCode(65 + opcaoIdx);
            opcoesHTML += `
                <label class="opcao-item" id="label-em-${questao.id}-${opcaoIdx}">
                    <input type="checkbox" name="em_${questao.id}" value="${opcaoIdx}" data-qid="${questao.id}">
                    <span><strong>${letra})</strong> ${textoOpcao}</span>
                </label>
            `;
        });

        const artigo = document.createElement('article');
        artigo.className = 'pergunta-bloco';
        artigo.id = idBloco;
        artigo.innerHTML = `
            <div class="pergunta-cabecalho">
                <span class="pergunta-numero">Questão ${numero}</span>
                <span class="pergunta-cotacao">Cotação: ${cotacaoUnitaria} val.</span>
            </div>
            <p class="pergunta-enunciado">${enunciadoLimpo}</p>
            <div class="opcoes-lista">
                ${opcoesHTML}
            </div>
            <div id="explicacao-em-${questao.id}" class="oculto" style="margin-top: 0.75rem; font-size: 0.85rem;"></div>
        `;
        containerEM.appendChild(artigo);

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

    containerEM.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const qid = e.target.getAttribute('data-qid');
            const selecionados = document.querySelectorAll(`input[name="em_${qid}"]:checked`);
            const btnPaleta = document.getElementById(`paleta-btn-${qid}`);
            if (btnPaleta) {
                btnPaleta.classList.toggle('respondida', selecionados.length > 0);
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
        const selecionadas = document.querySelectorAll(`input[name="em_${q.id}"]:checked`);
        if (selecionadas.length > 0) respondidas++;
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
        const inputsSelecionados = Array.from(document.querySelectorAll(`input[name="em_${q.id}"]:checked`));
        const valoresSelecionados = inputsSelecionados.map(inp => parseInt(inp.value, 10)).sort((a, b) => a - b);
        const valoresCorretos = obterArrayRespostasCorretas(q.resposta_correta).slice().sort((a, b) => a - b);

        const btnPaleta = document.getElementById(`paleta-btn-${q.id}`);

        q.opcoes.forEach((_, idx) => {
            const label = document.getElementById(`label-em-${q.id}-${idx}`);
            if (label) label.classList.remove('correta', 'incorreta');
        });
        if (btnPaleta) btnPaleta.classList.remove('correta', 'incorreta');

        valoresCorretos.forEach(idxCorreto => {
            const labelCorreta = document.getElementById(`label-em-${q.id}-${idxCorreto}`);
            if (labelCorreta) labelCorreta.classList.add('correta');
        });

        valoresSelecionados.forEach(idxSel => {
            if (!valoresCorretos.includes(idxSel)) {
                const labelErrada = document.getElementById(`label-em-${q.id}-${idxSel}`);
                if (labelErrada) labelErrada.classList.add('incorreta');
            }
        });

        const acertouTotalmente =
            valoresSelecionados.length === valoresCorretos.length &&
            valoresSelecionados.every((val, index) => val === valoresCorretos[index]);

        if (acertouTotalmente) {
            certas++;
            if (btnPaleta) btnPaleta.classList.add('correta');
        } else {
            if (btnPaleta) btnPaleta.classList.add('incorreta');
        }

        const divExplicacao = document.getElementById(`explicacao-em-${q.id}`);
        if (divExplicacao && q.justificacao) {
            divExplicacao.classList.remove('oculto');
            divExplicacao.innerHTML = `<strong>Fundamentação:</strong> ${q.justificacao}`;
        }
    });

    const total = lista.length;
    const percentagem = Math.round((certas / total) * 100);
    const notaEscala20 = ((certas / total) * 20).toFixed(1);

    localStorage.setItem(`${STORAGE_PREFIX}ultimo_score_em`, `${certas}/${total} (${notaEscala20} val.)`);
    atualizarKPIsDashboard();

    const painelResultados = document.getElementById('resultados-em');
    if (painelResultados) {
        painelResultados.classList.remove('oculto');
        painelResultados.innerHTML = `
            <h3>Classificação Final: ${notaEscala20} / 20 valores (${percentagem}%)</h3>
            <p>Respostas corretas: <strong>${certas}</strong> em <strong>${total}</strong>.</p>
        `;
        painelResultados.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function reiniciarTesteEM() {
    const painelResultados = document.getElementById('resultados-em');
    if (painelResultados) {
        painelResultados.classList.add('oculto');
        painelResultados.innerHTML = '';
    }

    gerarNovoExameSorteado();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   5. MÓDULO DE EXAME: QUESTÕES DE DESENVOLVIMENTO (VALIDAÇÃO LEXICAL)
   ========================================================================== */
function renderizarDesenvolvimento(listaQuestoes) {
    const containerDev = document.getElementById('contentor-desenvolvimento');
    const acoesDev = document.getElementById('acoes-form-dev');
    if (!containerDev) return;

    containerDev.innerHTML = '';

    if (listaQuestoes.length === 0) {
        containerDev.innerHTML = `
            <div class="pergunta-bloco">
                <p class="pergunta-enunciado">Ainda não existem questões de desenvolvimento configuradas.</p>
            </div>
        `;
        if (acoesDev) acoesDev.classList.add('oculto');
        return;
    }

    if (acoesDev) acoesDev.classList.remove('oculto');

    listaQuestoes.forEach((questao, idx) => {
        const numero = idx + 1;
        const chaveRascunho = `${STORAGE_PREFIX}rascunho_dev_${questao.id}`;
        const textoGuardado = localStorage.getItem(chaveRascunho) || '';
        const palavras = questao.palavras_chave || [];
        const listaPalavras = palavras.join(' • ');

        const artigo = document.createElement('article');
        artigo.className = 'pergunta-bloco';
        artigo.innerHTML = `
            <div class="pergunta-cabecalho">
                <span class="pergunta-numero">Questão ${numero}</span>
                <span class="pergunta-cotacao">Resposta Aberta</span>
            </div>
            <p class="pergunta-enunciado">${questao.pergunta}</p>
            <div class="dica-palavras-chave oculto" id="dica-dev-${questao.id}">
                <strong>Conceitos-chave esperados (${palavras.length}):</strong> ${listaPalavras}
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

    containerDev.querySelectorAll('.textarea-desenvolvimento').forEach(textarea => {
        textarea.addEventListener('input', (e) => {
            const qid = e.target.getAttribute('data-qid');
            localStorage.setItem(`${STORAGE_PREFIX}rascunho_dev_${qid}`, e.target.value);
        });
    });
}

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
        const palavrasChave = q.palavras_chave || [];

        palavrasChave.forEach(termoOriginal => {
            const termoNormalizado = normalizarTextoLexical(termoOriginal);
            if (respostaNormalizada.includes(termoNormalizado)) {
                encontradas.push(termoOriginal);
            } else {
                emFalta.push(termoOriginal);
            }
        });

        const badgesHTML = [
            ...encontradas.map(t => `<span class="kw-badge encontrada">✓ ${t}</span>`),
            ...emFalta.map(t => `<span class="kw-badge falta">✗ ${t}</span>`)
        ].join('');

        divFeedback.classList.remove('oculto');

        if (emFalta.length === 0 && palavrasChave.length > 0) {
            questoesDominadas++;
            divFeedback.className = 'feedback-palavra-chave';
            divFeedback.innerHTML = `
                <strong>Rigor conceptual completo (${encontradas.length}/${palavrasChave.length} conceitos integrados).</strong>
                <div class="kw-badges-container">${badgesHTML}</div>
            `;
        } else {
            divFeedback.className = 'feedback-palavra-chave falha';
            divFeedback.innerHTML = `
                <strong>Cobertura parcial: incluiu ${encontradas.length} de ${palavrasChave.length} conceitos-chave.</strong>
                <div class="kw-badges-container">${badgesHTML}</div>
            `;
        }
    });

    localStorage.setItem(`${STORAGE_PREFIX}ultimo_score_dev`, `${questoesDominadas} / ${lista.length} validadas`);
    atualizarKPIsDashboard();

    const painelResultadosDev = document.getElementById('resultados-dev');
    if (painelResultadosDev) {
        painelResultadosDev.classList.remove('oculto');
        painelResultadosDev.innerHTML = `
            <h3>Avaliação Concluída: ${questoesDominadas} de ${lista.length} questões com todos os conceitos-chave</h3>
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