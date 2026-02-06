let dataAtual = new Date();
let dataSelecionada = null;
let horarioSelecionado = null;
let usuarioLogado = null;

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

const modal = document.getElementById('modalHorarios');
const modalLogin = document.getElementById('modalLogin');
const modalRegistro = document.getElementById('modalRegistro');
const modalConfirmacao = document.getElementById('modalConfirmacao');
const fecharModal = document.querySelectorAll('.fechar-modal');
const mesAnterior = document.getElementById('mesAnterior');
const mesProximo = document.getElementById('mesProximo');
const formLogin = document.getElementById('formLogin');
const formRegistro = document.getElementById('formRegistro');
const btnConfirmarAgendamento = document.getElementById('btnConfirmarAgendamento');
const btnFecharConfirmacao = document.getElementById('btnFecharConfirmacao');
const btnCriarConta = document.getElementById('btnCriarConta');
const btnVoltarLogin = document.getElementById('btnVoltarLogin');

// Email da clínica
const EMAIL_CLINICA = 'clinica@example.com';

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderizarCalendario();
    verificarLogin();
    
    // Event listeners para fechar modais
    fecharModal.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });
    
    // Fechar modal ao clicar fora do conteúdo
    document.querySelectorAll('.modal').forEach(m => {
        m.addEventListener('click', (e) => {
            if (e.target === m) {
                m.classList.remove('active');
            }
        });
    });
    
    // Login
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        fazerLogin();
    });
    
    // Registro
    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        criarConta();
    });
    
    // Botões de navegação entre login e registro
    btnCriarConta.addEventListener('click', () => {
        modalLogin.classList.remove('active');
        modalRegistro.classList.add('active');
    });
    
    btnVoltarLogin.addEventListener('click', () => {
        modalRegistro.classList.remove('active');
        modalLogin.classList.add('active');
    });
    
    // Confirmar agendamento
    btnConfirmarAgendamento.addEventListener('click', confirmarAgendamento);
    btnFecharConfirmacao.addEventListener('click', () => {
        modalConfirmacao.classList.remove('active');
    });
});

// Navegação entre meses
mesAnterior.addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    renderizarCalendario();
});

mesProximo.addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    renderizarCalendario();
});

function verificarLogin() {
    const usuarioArmazenado = localStorage.getItem('usuarioLogado');
    if (usuarioArmazenado) {
        usuarioLogado = JSON.parse(usuarioArmazenado);
        atualizarUIUsuario();
    }
}

function atualizarUIUsuario() {
    const usuarioInfoDiv = document.getElementById('usuarioInfo');
    if (usuarioLogado) {
        usuarioInfoDiv.className = 'usuario-info logado';
        usuarioInfoDiv.innerHTML = `
            <span>👤 Logado como: <strong>${usuarioLogado.nome}</strong></span>
            <button onclick="fazerLogout()">Sair</button>
        `;
    } else {
        usuarioInfoDiv.className = 'usuario-info';
        usuarioInfoDiv.innerHTML = '';
    }
}

function fazerLogin() {
    const email = document.getElementById('emailLogin').value;
    
    // Verificar se a conta existe
    const contas = JSON.parse(localStorage.getItem('contas')) || [];
    const contaExistente = contas.find(c => c.email === email);
    
    if (!contaExistente) {
        mostrarErroLogin('E-mail não encontrado. Crie uma conta!');
        return;
    }
    
    usuarioLogado = contaExistente;
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
    
    formLogin.reset();
    limparErroLogin();
    modalLogin.classList.remove('active');
    atualizarUIUsuario();
}

function mostrarErroLogin(mensagem) {
    let erroDiv = document.getElementById('erroLogin');
    if (!erroDiv) {
        erroDiv = document.createElement('div');
        erroDiv.id = 'erroLogin';
        erroDiv.className = 'erro';
        formLogin.parentNode.insertBefore(erroDiv, formLogin);
    }
    erroDiv.textContent = mensagem;
    erroDiv.style.display = 'block';
}

function limparErroLogin() {
    const erroDiv = document.getElementById('erroLogin');
    if (erroDiv) {
        erroDiv.style.display = 'none';
    }
}

function criarConta() {
    const nome = document.getElementById('nomeRegistro').value;
    const email = document.getElementById('emailRegistro').value;
    const telefone = document.getElementById('telefoneRegistro').value;
    
    // Obter contas existentes
    const contas = JSON.parse(localStorage.getItem('contas')) || [];
    
    // Verificar se e-mail já existe
    if (contas.some(c => c.email === email)) {
        mostrarErroRegistro('E-mail já cadastrado! Use outro e-mail ou faça login.');
        return;
    }
    
    // Criar nova conta
    const novaConta = { nome, email, telefone };
    contas.push(novaConta);
    localStorage.setItem('contas', JSON.stringify(contas));
    
    // Fazer login automático
    usuarioLogado = novaConta;
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
    
    formRegistro.reset();
    limparErroRegistro();
    modalRegistro.classList.remove('active');
    atualizarUIUsuario();
    
    // Mostrar mensagem de sucesso
    alert(`✅ Conta criada com sucesso! Bem-vindo, ${nome}!`);
}

function mostrarErroRegistro(mensagem) {
    let erroDiv = document.getElementById('erroRegistro');
    if (!erroDiv) {
        erroDiv = document.createElement('div');
        erroDiv.id = 'erroRegistro';
        erroDiv.className = 'erro';
        formRegistro.parentNode.insertBefore(erroDiv, formRegistro);
    }
    erroDiv.textContent = mensagem;
    erroDiv.style.display = 'block';
}

function limparErroRegistro() {
    const erroDiv = document.getElementById('erroRegistro');
    if (erroDiv) {
        erroDiv.style.display = 'none';
    }
}

function fazerLogout() {
    usuarioLogado = null;
    localStorage.removeItem('usuarioLogado');
    atualizarUIUsuario();
    horarioSelecionado = null;
}

function renderizarCalendario() {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    
    document.getElementById('mesAno').textContent = `${meses[mes]} ${ano}`;
    
    const calendarioDiv = document.getElementById('calendario');
    calendarioDiv.innerHTML = '';
    
    // Adicionar cabeçalho com dias da semana
    const diasSemanaDiv = document.createElement('div');
    diasSemanaDiv.className = 'dias-semana';
    diasSemana.forEach(dia => {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'dia-semana';
        diaDiv.textContent = dia;
        diasSemanaDiv.appendChild(diaDiv);
    });
    calendarioDiv.appendChild(diasSemanaDiv);
    
    // Primeiro dia do mês
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const ultimoDiaAnterior = new Date(ano, mes, 0).getDate();
    
    // Dias do mês anterior
    for (let i = primeiroDia - 1; i >= 0; i--) {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'dia outro-mes';
        diaDiv.textContent = ultimoDiaAnterior - i;
        calendarioDiv.appendChild(diaDiv);
    }
    
    // Dias do mês atual
    for (let dia = 1; dia <= ultimoDia; dia++) {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'dia';
        diaDiv.textContent = dia;
        
        const dataClique = new Date(ano, mes, dia);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        if (dataClique < hoje) {
            diaDiv.classList.add('outro-mes');
            diaDiv.style.cursor = 'not-allowed';
        } else {
            diaDiv.addEventListener('click', () => verificarLoginEAbrirModalHorarios(dataClique));
            diaDiv.style.cursor = 'pointer';
        }
        
        calendarioDiv.appendChild(diaDiv);
    }
    
    // Dias do próximo mês
    const diasRestantes = 42 - (primeiroDia + ultimoDia);
    for (let dia = 1; dia <= diasRestantes; dia++) {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'dia outro-mes';
        diaDiv.textContent = dia;
        calendarioDiv.appendChild(diaDiv);
    }
}

function verificarLoginEAbrirModalHorarios(data) {
    if (!usuarioLogado) {
        modalLogin.classList.add('active');
        document.getElementById('email').focus();
    } else {
        abrirModalHorarios(data);
    }
}

function abrirModalHorarios(data) {
    dataSelecionada = data;
    horarioSelecionado = null;
    
    // Formatar a data para exibição
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = data.toLocaleDateString('pt-BR', opcoes);
    document.getElementById('dataModal').textContent = `Horários disponíveis para ${dataFormatada}`;
    
    // Mostrar usuário logado
    const usuarioLogadoDiv = document.getElementById('usuarioLogado');
    usuarioLogadoDiv.innerHTML = `✅ Logado como: <strong>${usuarioLogado.nome}</strong> (${usuarioLogado.email})`;
    
    // Gerar horários de 07:00 até 21:00
    const listaHorarios = document.getElementById('listaHorarios');
    listaHorarios.innerHTML = '';
    
    for (let hora = 7; hora <= 21; hora++) {
        const horarioDiv = document.createElement('div');
        horarioDiv.className = 'horario';
        horarioDiv.textContent = `${String(hora).padStart(2, '0')}:00`;
        horarioDiv.dataset.hora = hora;
        
        horarioDiv.addEventListener('click', () => selecionarHorario(horarioDiv, hora));
        listaHorarios.appendChild(horarioDiv);
    }
    
    btnConfirmarAgendamento.style.display = 'none';
    modal.classList.add('active');
}

function selecionarHorario(elemento, hora) {
    // Remover seleção anterior
    document.querySelectorAll('.horario').forEach(h => {
        h.classList.remove('selecionado');
    });
    
    // Adicionar seleção ao horário clicado
    elemento.classList.add('selecionado');
    horarioSelecionado = hora;
    
    // Mostrar botão de confirmar
    btnConfirmarAgendamento.style.display = 'block';
}

function confirmarAgendamento() {
    if (!dataSelecionada || !horarioSelecionado || !usuarioLogado) {
        alert('Erro: dados incompletos!');
        return;
    }
    
    // Fechar modal de horários
    modal.classList.remove('active');
    
    // Preparar dados do agendamento
    const dataFormatada = dataSelecionada.toLocaleDateString('pt-BR');
    const horarioFormatado = `${String(horarioSelecionado).padStart(2, '0')}:00`;
    
    const detalhesAgendamento = {
        data: dataFormatada,
        horario: horarioFormatado,
        cliente: usuarioLogado.nome,
        email: usuarioLogado.email,
        telefone: usuarioLogado.telefone
    };
    
    // Enviar email para a clínica
    enviarEmailClinica(detalhesAgendamento);
    
    // Mostrar modal de confirmação
    mostrarConfirmacao(detalhesAgendamento);
}

function enviarEmailClinica(detalhes) {
    // Simular envio de email via EmailJS ou API
    // Para este exemplo, vamos simular com um console log
    const emailContent = `
        NOVO AGENDAMENTO CONFIRMADO
        ==========================
        
        Cliente: ${detalhes.cliente}
        Email: ${detalhes.email}
        Telefone: ${detalhes.telefone}
        
        Data: ${detalhes.data}
        Horário: ${detalhes.horario}
        
        ---
        Mensagem enviada automaticamente pelo Sistema de Agendamento
    `;
    
    console.log('Email enviado para:', EMAIL_CLINICA);
    console.log(emailContent);
    
    // Aqui você poderia integrar com um serviço de email real:
    // - EmailJS (https://www.emailjs.com/)
    // - SendGrid
    // - Firebase Functions
    // - Backend Node.js/PHP
    
    // Para demonstração, vamos usar um fetch para simular
    fetch('https://formspree.io/f/exemplo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
    },
        body: JSON.stringify({
            email: EMAIL_CLINICA,
            assunto: `Novo Agendamento - ${detalhes.cliente}`,
            mensagem: emailContent
        })
    }).catch(() => {
        // Ignorar erros (para demonstração)
        console.log('Email enviado com sucesso (simulado)');
    });
}

function mostrarConfirmacao(detalhes) {
    const detalhesDiv = document.getElementById('detalhesAgendamento');
    detalhesDiv.innerHTML = `
        <strong>Cliente:</strong> ${detalhes.cliente}<br>
        <strong>Email:</strong> ${detalhes.email}<br>
        <strong>Telefone:</strong> ${detalhes.telefone}<br>
        <strong>Data:</strong> ${detalhes.data}<br>
        <strong>Horário:</strong> ${detalhes.horario}
    `;
    
    const mensagemEmail = document.getElementById('mensagemEmail');
    mensagemEmail.innerHTML = `✉️ Um e-mail de confirmação foi enviado para <strong>${EMAIL_CLINICA}</strong>`;
    
    modalConfirmacao.classList.add('active');
}