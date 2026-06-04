const API_URL = 'https://gvs-api.onrender.com/api';

// Função de Hash SHA-256 (Web Crypto API)
async function hashPassword(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const ADMIN_HASH = 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7';

window.showAlert = function(msg) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const box = document.createElement('div');
    box.className = 'glass-panel modal-content';
    box.style.textAlign = 'center';
    
    box.innerHTML = `
        <p style="margin-bottom: 24px; font-size: 16px; line-height: 1.5; color: var(--text-primary);">${msg}</p>
        <button class="btn btn-primary" onclick="
            const ov = this.closest('.modal-overlay');
            ov.classList.remove('active');
            setTimeout(() => ov.remove(), 300);
        " style="width: 100%; justify-content: center;">OK</button>
    `;
    
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.classList.add('active'), 10);
};

window.showConfirm = function(msg, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const box = document.createElement('div');
    box.className = 'glass-panel modal-content';
    box.style.textAlign = 'center';
    
    box.innerHTML = `
        <p style="margin-bottom: 24px; font-size: 16px; line-height: 1.5; color: var(--text-primary);">${msg}</p>
        <div style="display: flex; gap: 16px;">
            <button id="btn-cancel" class="btn" style="flex: 1; justify-content: center; background: transparent; border: 1px solid var(--border-color); color: var(--text-primary);">Cancelar</button>
            <button id="btn-confirm" class="btn btn-primary" style="flex: 1; justify-content: center;">Confirmar</button>
        </div>
    `;
    
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const cancelFn = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    };

    box.querySelector('#btn-cancel').onclick = cancelFn;

    box.querySelector('#btn-confirm').onclick = () => {
        cancelFn();
        // Wait for animation to finish before firing confirm action if needed, or just fire immediately
        setTimeout(onConfirm, 100);
    };
    
    setTimeout(() => overlay.classList.add('active'), 10);
};

// Elementos da UI
const navItems = document.querySelectorAll('.nav-item');
const contentArea = document.getElementById('content-area');
const pageTitle = document.getElementById('page-title');
const btnNovo = document.getElementById('btn-novo');
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');

// Elementos do Modal
const modalBase = document.getElementById('modal-base');
const modalTitle = document.getElementById('modal-title');
const modalFormContainer = document.getElementById('modal-form-container');
const btnCloseModal = document.querySelector('.close-modal');

// Estado
let currentRoute = 'dashboard';
window.currentDataList = [];
window.filteredDataList = [];
let sortField = null;
let sortAsc = true;
window.currentPage = 1;
window.itemsPerPage = 10;

// Checagem de Login Frontend MOCK
if(localStorage.getItem('gvs_auth') !== 'true') {
    window.location.href = 'login.html';
}

// ================= MÁSCARAS DE INPUT =================
window.maskPhone = function(el) {
    let v = el.value.replace(/\D/g, "");
    if(v.length > 11) v = v.slice(0, 11);
    if(v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    else if(v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    else if(v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    el.value = v;
}

window.maskCNPJ = function(el) {
    let v = el.value.replace(/\D/g, "");
    if(v.length > 14) v = v.slice(0, 14);
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
    el.value = v;
}

window.maskCPF_CNPJ = function(el) {
    let v = el.value.replace(/\D/g, "");
    if (v.length <= 11) {
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        if(v.length > 14) v = v.slice(0, 14);
        v = v.replace(/^(\d{2})(\d)/, "$1.$2");
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
        v = v.replace(/(\d{4})(\d)/, "$1-$2");
    }
    el.value = v;
}

window.maskCurrency = function(el) {
    let v = el.value.replace(/\D/g, "");
    if(!v) return;
    v = (v / 100).toFixed(2) + '';
    v = v.replace(".", ",");
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    el.value = "R$ " + v;
}

// Navegação Mobile
if(mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Navegação
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('data-target');
        navigateTo(target);
    });
});
window.routeHistory = [];

window.navigateTo = function(target, isBack = false) {
    if(currentRoute && !isBack) {
        window.routeHistory.push(currentRoute);
    }
    navItems.forEach(nav => nav.classList.remove('active'));
    document.querySelector(`[data-target="${target}"]`)?.classList.add('active');
    currentRoute = target;
    sortField = null;
    window.currentPage = 1;
    searchInput.value = '';
    if(window.innerWidth <= 768) sidebar.classList.remove('active');
    renderRoute();
}

window.goBack = function() {
    if(window.routeHistory && window.routeHistory.length > 0) {
        const previousRoute = window.routeHistory.pop();
        navigateTo(previousRoute, true);
    } else {
        navigateTo('dashboard', true);
    }
}
// Pesquisa e Filtros
window.applyFilters = function() {
    const term = searchInput.value.toLowerCase();
    const statusVal = document.getElementById('status-filter')?.value || 'todos';
    
    window.currentPage = 1;
    
    window.filteredDataList = window.currentDataList.filter(item => {
        let matchesSearch = true;
        if (term) {
            matchesSearch = Object.values(item).some(val => 
                val !== null && val !== undefined && val.toString().toLowerCase().includes(term)
            );
        }
        
        let matchesStatus = true;
        if (statusVal !== 'todos') {
            let itemStatus = 'ativo';
            if (item.status) {
                if (item.status === 'inativo' || item.status === 'encerrado' || item.status === 'cancelado') itemStatus = 'inativo';
            } else if (item.hasOwnProperty('disponivel')) {
                itemStatus = item.disponivel ? 'ativo' : 'inativo';
            }
            matchesStatus = (itemStatus === statusVal);
        }
        
        return matchesSearch && matchesStatus;
    });
    
    if(currentRoute === 'clientes') renderClientes(false);
    else if(currentRoute === 'prestadores') renderPrestadores(false);
    else if(currentRoute === 'contratos') renderContratos(false);
    else if(currentRoute === 'ordens') renderOrdens(false);
    else if(currentRoute === 'historico') renderHistorico(false);
    else if(currentRoute === 'usuarios') renderUsuarios(false);
};

// Renderizador principal
async function renderRoute() {
    contentArea.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    btnNovo.style.display = 'none';
    searchContainer.style.display = 'block';

    try {
        switch(currentRoute) {
            case 'dashboard':
                pageTitle.textContent = 'Dashboard Overview';
                searchContainer.style.display = 'none';
                await renderDashboard();
                break;
            case 'clientes':
                pageTitle.textContent = 'Gestão de Clientes';
                btnNovo.style.display = 'inline-flex';
                await renderClientes();
                break;
            case 'prestadores':
                pageTitle.textContent = 'Gestão de Prestadores';
                btnNovo.style.display = 'inline-flex';
                await renderPrestadores();
                break;
            case 'contratos':
                pageTitle.textContent = 'Contratos Ativos';
                btnNovo.style.display = 'inline-flex';
                await renderContratos();
                break;
            case 'ordens':
                pageTitle.textContent = 'Ordens de Serviço';
                btnNovo.style.display = 'inline-flex';
                await renderOrdens();
                break;
            case 'historico':
                pageTitle.textContent = 'Auditoria do Sistema';
                await renderHistorico();
                break;
            case 'usuarios':
                pageTitle.textContent = 'Usuários do Sistema';
                btnNovo.style.display = 'inline-flex';
                await renderUsuarios();
                break;
        }
    } catch (error) {
        contentArea.innerHTML = `<p style="color: var(--danger)">Erro ao carregar os dados: ${error.message}</p>`;
    }
}

// ================= ORDENAÇÃO E PAGINAÇÃO =================

window.sortData = function(field, type) {
    if(sortField === field) sortAsc = !sortAsc;
    else { sortField = field; sortAsc = true; }
    
    window.filteredDataList.sort((a, b) => {
        let valA = a[field] || '';
        let valB = b[field] || '';
        if(field.includes('.')) {
            const parts = field.split('.');
            valA = a[parts[0]] ? a[parts[0]][parts[1]] : '';
            valB = b[parts[0]] ? b[parts[0]][parts[1]] : '';
        }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
    });

    window.currentPage = 1;

    if(type === 'clientes') renderClientes(false);
    else if(type === 'prestadores') renderPrestadores(false);
    else if(type === 'contratos') renderContratos(false);
    else if(type === 'ordens') renderOrdens(false);
    else if(type === 'historico') renderHistorico(false);
    else if(type === 'usuarios') renderUsuarios(false);
}

function getSortIcon(field) {
    if(sortField !== field) return "<i class='bx bx-sort' style='color: var(--text-secondary); margin-left: 5px; opacity: 0.5;'></i>";
    return sortAsc ? "<i class='bx bx-sort-a-z' style='color: var(--accent-color); margin-left: 5px;'></i>" : "<i class='bx bx-sort-z-a' style='color: var(--accent-color); margin-left: 5px;'></i>";
}

window.changePage = function(delta, type) {
    const totalPages = Math.ceil(window.filteredDataList.length / window.itemsPerPage);
    let newPage = window.currentPage + delta;
    if(newPage < 1) newPage = 1;
    if(newPage > totalPages) newPage = totalPages;
    window.currentPage = newPage;
    
    if(type === 'clientes') renderClientes(false);
    else if(type === 'prestadores') renderPrestadores(false);
    else if(type === 'contratos') renderContratos(false);
    else if(type === 'ordens') renderOrdens(false);
    else if(type === 'historico') renderHistorico(false);
    else if(type === 'usuarios') renderUsuarios(false);
}

window.changeItemsPerPage = function(el, type) {
    window.itemsPerPage = parseInt(el.value);
    window.currentPage = 1;
    if(type === 'clientes') renderClientes(false);
    else if(type === 'prestadores') renderPrestadores(false);
    else if(type === 'contratos') renderContratos(false);
    else if(type === 'ordens') renderOrdens(false);
    else if(type === 'historico') renderHistorico(false);
    else if(type === 'usuarios') renderUsuarios(false);
}

function getPaginationHtml(type) {
    const totalItems = window.filteredDataList.length;
    if (totalItems === 0) return '';
    
    const totalPages = Math.ceil(totalItems / window.itemsPerPage) || 1;
    const startItem = ((window.currentPage - 1) * window.itemsPerPage) + 1;
    const endItem = Math.min(window.currentPage * window.itemsPerPage, totalItems);

    return `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding: 10px; color: var(--text-secondary); font-size: 13px; flex-wrap: wrap; gap: 10px;">
            <div>
                Exibindo <strong>${startItem}</strong> a <strong>${endItem}</strong> de <strong>${totalItems}</strong> registros
            </div>
            <div style="display: flex; gap: 15px; align-items: center;">
                <label style="display: flex; align-items: center; gap: 5px;">
                    Mostrar
                    <select onchange="changeItemsPerPage(this, '${type}')" class="pagination-select">
                        <option value="5" ${window.itemsPerPage===5?'selected':''}>5</option>
                        <option value="10" ${window.itemsPerPage===10?'selected':''}>10</option>
                        <option value="25" ${window.itemsPerPage===25?'selected':''}>25</option>
                        <option value="50" ${window.itemsPerPage===50?'selected':''}>50</option>
                    </select>
                </label>
                <div style="display: flex; gap: 5px; align-items: center;">
                    <button class="btn-icon" onclick="changePage(-1, '${type}')" ${window.currentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}><i class='bx bx-chevron-left'></i></button>
                    <span style="display: flex; align-items: center; padding: 0 10px; font-weight: 500;">Página ${window.currentPage} de ${totalPages}</span>
                    <button class="btn-icon" onclick="changePage(1, '${type}')" ${window.currentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}><i class='bx bx-chevron-right'></i></button>
                </div>
            </div>
        </div>
    `;
}

// ================= FETCH DE DADOS E RENDERIZAÇÃO =================

async function renderDashboard() {
    const [resClientes, resPrest, resContr, resHist] = await Promise.all([
        fetch(`${API_URL}/clientes`), fetch(`${API_URL}/prestadores`), fetch(`${API_URL}/contratos`), fetch(`${API_URL}/historico`)
    ]);

    const clientes = await resClientes.json();
    const prestadores = await resPrest.json();
    const contratos = await resContr.json();
    const historico = await resHist.json();

    let historyHtml = historico.slice(0, 5).map(h => `
        <div style="padding: 15px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong style="color: var(--accent-color);">${h.acao.toUpperCase()}</strong> em ${h.entidade}
                <br><small style="color: var(--text-secondary);">ID: ${h.documentoId}</small>
            </div>
            <span style="font-size: 12px; color: var(--text-secondary);">${new Date(h.data).toLocaleString('pt-BR')}</span>
        </div>
    `).join('');

    contentArea.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card glass-panel" style="cursor: pointer; transition: transform 0.2s;" onclick="navigateTo('clientes')" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <div class="stat-icon"><i class='bx bx-user'></i></div>
                <div class="stat-info">
                    <h3>Clientes Cadastrados</h3>
                    <p>${clientes.length || 0}</p>
                </div>
            </div>
            <div class="stat-card glass-panel" style="cursor: pointer; transition: transform 0.2s;" onclick="navigateTo('prestadores')" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <div class="stat-icon"><i class='bx bx-briefcase'></i></div>
                <div class="stat-info">
                    <h3>Prestadores Disponíveis</h3>
                    <p>${prestadores.filter(p => p.disponivel).length || 0}</p>
                </div>
            </div>
            <div class="stat-card glass-panel" style="cursor: pointer; transition: transform 0.2s;" onclick="navigateTo('contratos')" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <div class="stat-icon"><i class='bx bx-file'></i></div>
                <div class="stat-info">
                    <h3>Contratos Ativos</h3>
                    <p>${contratos.filter(c => c.status === 'ativo').length || 0}</p>
                </div>
            </div>
        </div>

        <div class="glass-panel" style="margin-top: 30px; padding: 20px;">
            <h3 style="margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <i class='bx bx-history' style="color: var(--accent-color);"></i> Atividades Recentes
            </h3>
            ${historyHtml || '<p style="color: var(--text-secondary);">Nenhuma atividade registrada ainda.</p>'}
            <div style="margin-top: 15px; text-align: center;">
                <a href="#" onclick="navigateTo('historico')" style="color: var(--accent-color); text-decoration: none; font-size: 14px; font-weight: bold;">Ver Auditoria Completa <i class='bx bx-right-arrow-alt'></i></a>
            </div>
        </div>
    `;
}

async function renderClientes(fetchData = true) {
    if(fetchData) {
        const response = await fetch(`${API_URL}/clientes`);
        window.currentDataList = await response.json();
        window.filteredDataList = [...window.currentDataList];
        window.currentPage = 1;
    }

    let html = `
    <div class="glass-panel data-table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th style="cursor: pointer;" onclick="sortData('razao_social', 'clientes')">Razão Social ${getSortIcon('razao_social')}</th>
                    <th style="cursor: pointer;" onclick="sortData('cnpj', 'clientes')">CNPJ ${getSortIcon('cnpj')}</th>
                    <th style="cursor: pointer;" onclick="sortData('email', 'clientes')">Email ${getSortIcon('email')}</th>
                    <th style="cursor: pointer; width: 180px;" onclick="sortData('telefone', 'clientes')">Telefone ${getSortIcon('telefone')}</th>
                    <th style="cursor: pointer;" onclick="sortData('status', 'clientes')">Status ${getSortIcon('status')}</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (window.filteredDataList.length === 0) {
        html += `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">Nenhum registro encontrado.</td></tr>`;
    }

    const start = (window.currentPage - 1) * window.itemsPerPage;
    const paginatedData = window.filteredDataList.slice(start, start + window.itemsPerPage);

    paginatedData.forEach(c => {
        const isAtivo = c.status === 'ativo';
        html += `
            <tr>
                <td><strong>${c.razao_social}</strong></td>
                <td>${c.cnpj}</td>
                <td>${c.email}</td>
                <td style="white-space: nowrap; width: 180px;">
                    <a href="https://wa.me/55${c.telefone.replace(/\D/g, '')}" target="_blank" style="color: #25D366; text-decoration: none; display: flex; align-items: center; gap: 5px; font-weight: 500;" title="Abrir no WhatsApp">
                        <i class='bx bxl-whatsapp' style="font-size: 18px;"></i> ${c.telefone}
                    </a>
                </td>
                <td><span class="status-badge status-${c.status}">${c.status.toUpperCase()}</span></td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-icon" title="Editar" onclick="editRecord('${c._id}', 'clientes')"><i class='bx bx-edit'></i></button>
                        <button class="btn-icon" title="${isAtivo ? 'Desativar' : 'Ativar'}" onclick="toggleStatus('${c._id}', 'clientes', '${c.status}')">
                            <i class='bx ${isAtivo ? 'bx-block' : 'bx-check-circle'}' style="color: ${isAtivo ? 'var(--warning)' : 'var(--success)'};"></i>
                        </button>
                        <button class="btn-icon" title="Excluir" onclick="deleteRecord('${c._id}', 'clientes')">
                            <i class='bx bx-trash' style="color: var(--danger);"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>${getPaginationHtml('clientes')}</div>`;
    contentArea.innerHTML = html;
}

async function renderPrestadores(fetchData = true) {
    if(fetchData) {
        const response = await fetch(`${API_URL}/prestadores`);
        window.currentDataList = await response.json();
        window.filteredDataList = [...window.currentDataList];
        window.currentPage = 1;
    }

    let html = `
    <div class="glass-panel data-table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th style="cursor: pointer;" onclick="sortData('nome', 'prestadores')">Nome ${getSortIcon('nome')}</th>
                    <th style="cursor: pointer;" onclick="sortData('cpf_cnpj', 'prestadores')">CPF/CNPJ ${getSortIcon('cpf_cnpj')}</th>
                    <th style="cursor: pointer; max-width: 150px;" onclick="sortData('especialidade', 'prestadores')">Especialidade ${getSortIcon('especialidade')}</th>
                    <th style="cursor: pointer; width: 180px;" onclick="sortData('telefone', 'prestadores')">Telefone ${getSortIcon('telefone')}</th>
                    <th style="cursor: pointer;" onclick="sortData('disponivel', 'prestadores')">Status ${getSortIcon('disponivel')}</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (window.filteredDataList.length === 0) {
        html += `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">Nenhum registro encontrado.</td></tr>`;
    }

    const start = (window.currentPage - 1) * window.itemsPerPage;
    const paginatedData = window.filteredDataList.slice(start, start + window.itemsPerPage);

    paginatedData.forEach(p => {
        const status = p.disponivel ? 'ativo' : 'inativo';
        const txtStatus = p.disponivel ? 'DISPONÍVEL' : 'OCUPADO';
        html += `
            <tr>
                <td><strong>${p.nome}</strong></td>
                <td>${p.cpf_cnpj}</td>
                <td style="max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.especialidade}">${p.especialidade}</td>
                <td style="white-space: nowrap; width: 180px;">
                    <a href="https://wa.me/55${p.telefone.replace(/\D/g, '')}" target="_blank" style="color: #25D366; text-decoration: none; display: flex; align-items: center; gap: 5px; font-weight: 500;" title="Abrir no WhatsApp">
                        <i class='bx bxl-whatsapp' style="font-size: 18px;"></i> ${p.telefone}
                    </a>
                </td>
                <td><span class="status-badge status-${status}">${txtStatus}</span></td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-icon" title="Editar" onclick="editRecord('${p._id}', 'prestadores')"><i class='bx bx-edit'></i></button>
                        <button class="btn-icon" title="${p.disponivel ? 'Marcar Ocupado' : 'Marcar Disponível'}" onclick="toggleStatus('${p._id}', 'prestadores', '${p.disponivel}')">
                            <i class='bx ${p.disponivel ? 'bx-x-circle' : 'bx-check-circle'}' style="color: ${p.disponivel ? 'var(--danger)' : 'var(--success)'};"></i>
                        </button>
                        <button class="btn-icon" title="Excluir" onclick="deleteRecord('${p._id}', 'prestadores')">
                            <i class='bx bx-trash' style="color: var(--danger);"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>${getPaginationHtml('prestadores')}</div>`;
    contentArea.innerHTML = html;
}

async function renderContratos(fetchData = true) {
    if(fetchData) {
        const response = await fetch(`${API_URL}/contratos`);
        window.currentDataList = await response.json();
        window.filteredDataList = [...window.currentDataList];
        window.currentPage = 1;
    }

    let html = `
    <div class="glass-panel data-table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th style="cursor: pointer;" onclick="sortData('_id', 'contratos')">ID do Contrato ${getSortIcon('_id')}</th>
                    <th style="cursor: pointer;" onclick="sortData('clienteId.razao_social', 'contratos')">Cliente ${getSortIcon('clienteId.razao_social')}</th>
                    <th style="cursor: pointer;" onclick="sortData('prestadorId.nome', 'contratos')">Prestador ${getSortIcon('prestadorId.nome')}</th>
                    <th style="cursor: pointer;" onclick="sortData('data_inicio', 'contratos')">Início ${getSortIcon('data_inicio')}</th>
                    <th style="cursor: pointer;" onclick="sortData('valor_acordado', 'contratos')">Valor ${getSortIcon('valor_acordado')}</th>
                    <th style="cursor: pointer;" onclick="sortData('status', 'contratos')">Status ${getSortIcon('status')}</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (window.filteredDataList.length === 0) {
        html += `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--text-secondary);">Nenhum registro encontrado.</td></tr>`;
    }

    const start = (window.currentPage - 1) * window.itemsPerPage;
    const paginatedData = window.filteredDataList.slice(start, start + window.itemsPerPage);

    paginatedData.forEach(c => {
        const clienteNome = c.clienteId?.razao_social || 'Desconhecido';
        const prestadorNome = c.prestadorId?.nome || 'Desconhecido';
        const data = new Date(c.data_inicio).toLocaleDateString('pt-BR');
        const valorFormatado = c.valor_acordado.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        const isAtivo = c.status === 'ativo';
        
        html += `
            <tr>
                <td>${c._id.substring(0,6).toUpperCase()}</td>
                <td><strong>${clienteNome}</strong></td>
                <td>${prestadorNome}</td>
                <td>${data}</td>
                <td>${valorFormatado}</td>
                <td><span class="status-badge status-${c.status}">${c.status.toUpperCase()}</span></td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-icon" title="Editar" onclick="editRecord('${c._id}', 'contratos')"><i class='bx bx-edit'></i></button>
                        <button class="btn-icon" title="${isAtivo ? 'Encerrar' : 'Ativar'}" onclick="toggleStatus('${c._id}', 'contratos', '${c.status}')">
                            <i class='bx ${isAtivo ? 'bx-power-off' : 'bx-play-circle'}' style="color: ${isAtivo ? 'var(--warning)' : 'var(--success)'};"></i>
                        </button>
                        <button class="btn-icon" title="Excluir" onclick="deleteRecord('${c._id}', 'contratos')">
                            <i class='bx bx-trash' style="color: var(--danger);"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>${getPaginationHtml('contratos')}</div>`;
    contentArea.innerHTML = html;
}

window.viewOrderDetails = function(id) {
    const record = window.currentDataList.find(r => r._id === id);
    if(!record) return;
    
    const isConcluida = record.status === 'concluida';
    
    openModal('Detalhes da Ordem de Serviço', `
        <div style="text-align: left;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <div>
                    <span style="color: var(--text-secondary); font-size: 13px;">Ordem:</span><br>
                    <strong style="color: var(--primary);">#OS-${record._id.substring(record._id.length - 4).toUpperCase()}</strong>
                </div>
                <div style="text-align: right;">
                    <span style="color: var(--text-secondary); font-size: 13px;">Status:</span><br>
                    <span class="status-badge status-${isConcluida ? 'ativo' : (record.status === 'pendente' ? 'pendente' : 'inativo')}">${record.status.toUpperCase()}</span>
                </div>
            </div>
            
            <p style="color: var(--text-secondary); margin-bottom: 5px; font-size: 13px;">Descrição da Atividade:</p>
            <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 6px; color: var(--text-primary); font-size: 14px; min-height: 80px; margin-bottom: 20px;">
                ${record.descricao ? record.descricao.replace(/\\n/g, '<br>') : 'Nenhuma descrição fornecida.'}
            </div>
            
            <p style="color: var(--text-secondary); margin-bottom: 10px; font-size: 13px; text-align: center;">Ações Rápidas</p>
            <div style="display: flex; gap: 10px; margin-bottom: 15px; justify-content: center;">
                <button class="btn-icon" title="Editar" onclick="closeModal(); setTimeout(() => editRecord('${record._id}', 'ordens-servico'), 300)" style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;"><i class='bx bx-edit' style="font-size: 20px;"></i></button>
                <button class="btn-icon" title="${isConcluida ? 'Reabrir' : 'Concluir'}" onclick="closeModal(); setTimeout(() => toggleStatus('${record._id}', 'ordens-servico', '${record.status}'), 300)" style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                    <i class='bx ${isConcluida ? 'bx-revision' : 'bx-check-double'}' style="color: ${isConcluida ? 'var(--text-secondary)' : 'var(--success)'}; font-size: 20px;"></i>
                </button>
                <button class="btn-icon" title="Excluir" onclick="closeModal(); setTimeout(() => deleteRecord('${record._id}', 'ordens-servico'), 300)" style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                    <i class='bx bx-trash' style="color: var(--danger); font-size: 20px;"></i>
                </button>
            </div>
            
            <button class="btn btn-primary" onclick="closeModal()" style="width: 100%; justify-content: center; background: transparent; border-color: var(--border-color); color: var(--text-primary);">Voltar para Tabela</button>
        </div>
    `);
}

async function renderOrdens(fetchData = true) {
    if(fetchData) {
        const response = await fetch(`${API_URL}/ordens-servico`);
        window.currentDataList = await response.json();
        
        const resCont = await fetch(`${API_URL}/contratos`);
        const contratos = await resCont.json();
        
        window.currentDataList.forEach(o => {
            const cId = typeof o.contratoId === 'object' ? o.contratoId?._id : o.contratoId;
            const contrato = contratos.find(c => c._id === cId);
            if (contrato) {
                o.solicitante = contrato.clienteId?.razao_social || 'Desconhecido';
                o.executor = contrato.prestadorId?.nome || 'Desconhecido';
            } else {
                o.solicitante = 'Desconhecido';
                o.executor = 'Desconhecido';
            }
        });
        
        window.filteredDataList = [...window.currentDataList];
        window.currentPage = 1;
    }

    let html = `
    <div class="glass-panel data-table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nº</th>
                    <th style="cursor: pointer;" onclick="sortData('solicitante', 'ordens')">Solicitante ${getSortIcon('solicitante')}</th>
                    <th style="cursor: pointer;" onclick="sortData('executor', 'ordens')">Executor ${getSortIcon('executor')}</th>
                    <th style="cursor: pointer;" onclick="sortData('data_execucao', 'ordens')">Data Execução ${getSortIcon('data_execucao')}</th>
                    <th style="cursor: pointer;" onclick="sortData('status', 'ordens')">Status ${getSortIcon('status')}</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (window.filteredDataList.length === 0) {
        html += `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">Nenhum registro encontrado.</td></tr>`;
    }

    const start = (window.currentPage - 1) * window.itemsPerPage;
    const paginatedData = window.filteredDataList.slice(start, start + window.itemsPerPage);

    paginatedData.forEach(o => {
        const data = new Date(o.data_execucao).toLocaleDateString('pt-BR');
        let badgeColor = o.status === 'pendente' ? 'pendente' : (o.status === 'concluida' ? 'ativo' : 'inativo');
        const isConcluida = o.status === 'concluida';
        
        html += `
            <tr>
                <td><strong style="color: var(--primary);">#OS-${o._id.substring(o._id.length - 4).toUpperCase()}</strong></td>
                <td><strong>${o.solicitante || 'Não Informado'}</strong></td>
                <td>${o.executor || 'Não Informado'}</td>
                <td>${data}</td>
                <td><span class="status-badge status-${badgeColor}">${o.status.toUpperCase()}</span></td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-icon" title="Ver Detalhes" onclick="viewOrderDetails('${o._id}')"><i class='bx bx-info-circle'></i></button>
                        <button class="btn-icon" title="Editar" onclick="editRecord('${o._id}', 'ordens-servico')"><i class='bx bx-edit'></i></button>
                        <button class="btn-icon" title="${isConcluida ? 'Reabrir' : 'Concluir'}" onclick="toggleStatus('${o._id}', 'ordens-servico', '${o.status}')">
                            <i class='bx ${isConcluida ? 'bx-revision' : 'bx-check-double'}' style="color: ${isConcluida ? 'var(--text-secondary)' : 'var(--success)'};"></i>
                        </button>
                        <button class="btn-icon" title="Excluir" onclick="deleteRecord('${o._id}', 'ordens-servico')">
                            <i class='bx bx-trash' style="color: var(--danger);"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>${getPaginationHtml('ordens')}</div>`;
    contentArea.innerHTML = html;
}

async function renderHistorico(fetchData = true) {
    if(fetchData) {
        const response = await fetch(`${API_URL}/historico`);
        window.currentDataList = await response.json();
        window.filteredDataList = [...window.currentDataList];
        window.currentPage = 1;
    }

    let html = `
    <div class="glass-panel data-table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th style="cursor: pointer;" onclick="sortData('data', 'historico')">Data/Hora ${getSortIcon('data')}</th>
                    <th style="cursor: pointer;" onclick="sortData('acao', 'historico')">Ação ${getSortIcon('acao')}</th>
                    <th style="cursor: pointer;" onclick="sortData('entidade', 'historico')">Entidade ${getSortIcon('entidade')}</th>
                    <th>Detalhes & Documento ID</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (window.filteredDataList.length === 0) {
        html += `<tr><td colspan="4" style="text-align: center; padding: 20px; color: var(--text-secondary);">Nenhum registro encontrado.</td></tr>`;
    }

    const start = (window.currentPage - 1) * window.itemsPerPage;
    const paginatedData = window.filteredDataList.slice(start, start + window.itemsPerPage);

    paginatedData.forEach(h => {
        const data = new Date(h.data).toLocaleString('pt-BR');
        let detalhesHtml = '';
        if(h.detalhes) {
            const detString = JSON.stringify(h.detalhes).replace(/["{}]/g, ' ').trim();
            if (detString) {
                detalhesHtml = `<div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${detString}">Detalhes: ${detString}</div>`;
            }
        }

        html += `
            <tr>
                <td>${data}</td>
                <td><span style="color: var(--accent-color); font-weight: bold;">${h.acao.toUpperCase()}</span></td>
                <td>${h.entidade}</td>
                <td>
                    <code style="background: rgba(0,0,0,0.3); padding: 4px; border-radius: 4px;">${h.documentoId}</code>
                    ${detalhesHtml}
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>${getPaginationHtml('historico')}</div>`;
    contentArea.innerHTML = html;
}


window.getSystemUsers = function() {
    let users = JSON.parse(localStorage.getItem('gvs_users') || '[]');
    if(!localStorage.getItem('gvs_presentation_seeded')) {
        users = [
            { _id: 'u1', username: 'admin', pass: ADMIN_HASH, status: 'ativo' },
            { _id: 'u2', username: 'matheus', pass: ADMIN_HASH, status: 'ativo' },
            { _id: 'u3', username: 'luis', pass: ADMIN_HASH, status: 'ativo' },
            { _id: 'u4', username: 'kevin', pass: ADMIN_HASH, status: 'ativo' },
            { _id: 'u5', username: 'dani', pass: ADMIN_HASH, status: 'ativo' }
        ];
        localStorage.setItem('gvs_users', JSON.stringify(users));
        localStorage.removeItem('gvs_custom_pass');
        localStorage.setItem('gvs_presentation_seeded', 'true');
    }
    return users;
};

async function renderUsuarios(fetchData = true) {
    if(fetchData) {
        window.currentDataList = window.getSystemUsers();
        window.filteredDataList = [...window.currentDataList];
        window.currentPage = 1;
    }

    let html = `
    <div class="glass-panel data-table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th style="cursor: pointer;" onclick="sortData('username', 'usuarios')">Usuário ${getSortIcon('username')}</th>
                    <th style="cursor: pointer;" onclick="sortData('status', 'usuarios')">Status ${getSortIcon('status')}</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (window.filteredDataList.length === 0) {
        html += `<tr><td colspan="3" style="text-align: center; padding: 20px; color: var(--text-secondary);">Nenhum registro encontrado.</td></tr>`;
    }

    const start = (window.currentPage - 1) * window.itemsPerPage;
    const paginatedData = window.filteredDataList.slice(start, start + window.itemsPerPage);

    paginatedData.forEach(u => {
        const isAtivo = u.status === 'ativo';
        html += `
            <tr>
                <td><strong>${u.username}</strong></td>
                <td><span class="status-badge status-${u.status}">${u.status.toUpperCase()}</span></td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-icon" title="Editar Senha" onclick="editRecord('${u._id}', 'usuarios')"><i class='bx bx-key'></i></button>
                        <button class="btn-icon" title="${isAtivo ? 'Desativar' : 'Ativar'}" onclick="toggleStatus('${u._id}', 'usuarios', '${u.status}')" ${u.username === 'admin' ? 'disabled style="opacity: 0.3;"' : ''}>
                            <i class='bx ${isAtivo ? 'bx-block' : 'bx-check-circle'}' style="color: ${isAtivo && u.username !== 'admin' ? 'var(--warning)' : 'var(--success)'};"></i>
                        </button>
                        <button class="btn-icon" title="Excluir" onclick="deleteRecord('${u._id}', 'usuarios')" ${u.username === 'admin' ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''}>
                            <i class='bx bx-trash' style="color: var(--danger);"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>${getPaginationHtml('usuarios')}</div>`;
    contentArea.innerHTML = html;
}

// Inicia a aplicação carregando o Dashboard
renderRoute();

// ================= LÓGICA DO MODAL E FORMULÁRIOS =================

btnCloseModal.addEventListener('click', closeModal);

function closeModal() {
    modalBase.classList.remove('active');
}

function openModal(title, formHTML) {
    modalTitle.textContent = title;
    modalFormContainer.innerHTML = formHTML;
    modalBase.classList.add('active');
}

// Ação Rápida: Ativar/Desativar
window.toggleStatus = function(id, type, currentStatus) {
    showConfirm('Deseja alterar o status deste registro?', async () => {
        let updatedData = {};
        if(type === 'clientes') updatedData = { status: currentStatus === 'ativo' ? 'inativo' : 'ativo' };
        else if(type === 'prestadores') updatedData = { disponivel: currentStatus === 'true' ? false : true };
        else if(type === 'contratos') updatedData = { status: currentStatus === 'ativo' ? 'encerrado' : 'ativo' };
        else if(type === 'ordens-servico') updatedData = { status: currentStatus === 'concluida' ? 'pendente' : 'concluida' };
        else if(type === 'usuarios') {
            let users = window.getSystemUsers();
            let u = users.find(x => x._id === id);
            if(u) {
                u.status = currentStatus === 'ativo' ? 'inativo' : 'ativo';
                localStorage.setItem('gvs_users', JSON.stringify(users));
                renderRoute();
                return;
            }
        }

        try {
            const response = await fetch(`${API_URL}/${type}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if(!response.ok) throw new Error('Falha ao alterar status');

            const entityName = type === 'ordens-servico' ? 'OrdemServico' : type.charAt(0).toUpperCase() + type.slice(1);
            await fetch(`${API_URL}/historico`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ acao: 'atualizacao_status', entidade: entityName, documentoId: id, detalhes: updatedData })
            }).catch(e => console.log('Erro ao salvar auditoria', e));

            renderRoute();
        } catch(err) {
            showAlert(err.message);
        }
    });
}

// Ação Rápida: Excluir
window.deleteRecord = function(id, type) {
    showConfirm('Tem certeza que deseja excluir este registro permanentemente?', async () => {
        try {
            if(type === 'usuarios') {
                let users = window.getSystemUsers();
                if(users.find(x => x._id === id)?.username === 'admin') {
                    showAlert('Não é possível excluir o administrador mestre.');
                    return;
                }
                users = users.filter(x => x._id !== id);
                localStorage.setItem('gvs_users', JSON.stringify(users));
                renderRoute();
                return;
            }

            const response = await fetch(`${API_URL}/${type}/${id}`, {
                method: 'DELETE'
            });

            if(!response.ok) throw new Error('Falha ao excluir registro');

            const entityName = type === 'ordens-servico' ? 'OrdemServico' : type.charAt(0).toUpperCase() + type.slice(1);
            await fetch(`${API_URL}/historico`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ acao: 'exclusao', entidade: entityName, documentoId: id, detalhes: {} })
            }).catch(e => console.log('Erro ao salvar auditoria', e));

            renderRoute();
        } catch(err) {
            showAlert(err.message);
        }
    });
}

// Global para abrir formulário de edição
window.editRecord = async function(id, type) {
    const record = window.currentDataList.find(r => r._id === id);
    if(!record) return;

    if (type === 'clientes') {
        openModal('Editar Cliente', `
            <form id="form-novo" onsubmit="submitForm(event, 'clientes', '${id}')">
                <div class="form-group">
                    <label>Razão Social</label>
                    <input type="text" name="razao_social" value="${record.razao_social}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>CNPJ</label>
                    <input type="text" name="cnpj" oninput="maskCNPJ(this)" value="${record.cnpj}" class="form-control" required placeholder="00.000.000/0000-00">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value="${record.email}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Telefone</label>
                    <input type="text" name="telefone" oninput="maskPhone(this)" value="${record.telefone}" class="form-control" required placeholder="(00) 00000-0000">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status" class="form-control" required>
                        <option value="ativo" ${record.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                        <option value="inativo" ${record.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Atualizar Cliente</button>
            </form>
        `);
    } else if (type === 'prestadores') {
        openModal('Editar Prestador', `
            <form id="form-novo" onsubmit="submitForm(event, 'prestadores', '${id}')">
                <div class="form-group">
                    <label>Nome Completo</label>
                    <input type="text" name="nome" value="${record.nome}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>CPF/CNPJ</label>
                    <input type="text" name="cpf_cnpj" oninput="maskCPF_CNPJ(this)" value="${record.cpf_cnpj}" class="form-control" required placeholder="000.000.000-00">
                </div>
                <div class="form-group">
                    <label>Especialidade / Serviço</label>
                    <input type="text" name="especialidade" value="${record.especialidade}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value="${record.email}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Telefone</label>
                    <input type="text" name="telefone" oninput="maskPhone(this)" value="${record.telefone}" class="form-control" required placeholder="(00) 00000-0000">
                </div>
                <div class="form-group">
                    <label>Disponibilidade</label>
                    <select name="disponivel" class="form-control" required>
                        <option value="true" ${record.disponivel === true ? 'selected' : ''}>Disponível</option>
                        <option value="false" ${record.disponivel === false ? 'selected' : ''}>Ocupado</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Atualizar Prestador</button>
            </form>
        `);
    } else if (type === 'contratos') {
        const [resCli, resPrest] = await Promise.all([
            fetch(`${API_URL}/clientes`), fetch(`${API_URL}/prestadores`)
        ]);
        const clientes = await resCli.json();
        const prestadores = await resPrest.json();
        
        let cliOptions = clientes.map(c => `<option value="${c._id}" ${record.clienteId?._id === c._id ? 'selected' : ''}>${c.razao_social}</option>`).join('');
        let prestOptions = prestadores.map(p => `<option value="${p._id}" ${record.prestadorId?._id === p._id ? 'selected' : ''}>${p.nome} (${p.especialidade})</option>`).join('');
        
        const valorMasked = "R$ " + (record.valor_acordado).toLocaleString('pt-BR', {minimumFractionDigits: 2});

        openModal('Editar Contrato', `
            <form id="form-novo" onsubmit="submitForm(event, 'contratos', '${id}')">
                <div class="form-group">
                    <label>Cliente</label>
                    <select name="clienteId" class="form-control" required>${cliOptions}</select>
                </div>
                <div class="form-group">
                    <label>Prestador</label>
                    <select name="prestadorId" class="form-control" required>${prestOptions}</select>
                </div>
                <div class="form-group">
                    <label>Valor Acordado</label>
                    <input type="text" name="valor_acordado" oninput="maskCurrency(this)" value="${valorMasked}" class="form-control" required placeholder="R$ 0,00">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status" class="form-control" required>
                        <option value="ativo" ${record.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                        <option value="encerrado" ${record.status === 'encerrado' ? 'selected' : ''}>Encerrado</option>
                        <option value="cancelado" ${record.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Atualizar Contrato</button>
            </form>
        `);
    } else if (type === 'ordens-servico') {
        const resCont = await fetch(`${API_URL}/contratos`);
        const contratos = await resCont.json();
        let contOptions = contratos.map(c => `<option value="${c._id}" ${record.contratoId === c._id ? 'selected' : ''}>${c.clienteId?.razao_social || 'Contrato'} - ${c.valor_acordado.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</option>`).join('');

        openModal('Editar Ordem de Serviço', `
            <form id="form-novo" onsubmit="submitForm(event, 'ordens-servico', '${id}')">
                <div class="form-group">
                    <label>Contrato Vinculado</label>
                    <select name="contratoId" class="form-control" required>${contOptions}</select>
                </div>
                <div class="form-group">
                    <label>Descrição da Atividade</label>
                    <textarea name="descricao" class="form-control" rows="4" style="resize: vertical;" required>${record.descricao}</textarea>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status" class="form-control" required>
                        <option value="pendente" ${record.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                        <option value="em andamento" ${record.status === 'em andamento' ? 'selected' : ''}>Em Andamento</option>
                        <option value="concluida" ${record.status === 'concluida' ? 'selected' : ''}>Concluída</option>
                        <option value="cancelada" ${record.status === 'cancelada' ? 'selected' : ''}>Cancelada</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Atualizar Ordem</button>
            </form>
        `);
    } else if (type === 'usuarios') {
        openModal('Alterar Senha do Usuário', `
            <form id="form-novo" onsubmit="submitForm(event, 'usuarios', '${id}')">
                <div class="form-group" style="text-align: left;">
                    <label>Nova Senha para ${record.username}</label>
                    <input type="password" name="pass" class="form-control" required 
                           pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
                           title="A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial">
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); text-align: left; margin-bottom: 15px;">
                    Requisitos: Mín. 8 caracteres, 1 Maiúscula, 1 Número, 1 Caractere Especial (!@#$)
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Atualizar Senha</button>
            </form>
        `);
    }
};

btnNovo.addEventListener('click', async () => {
    if (currentRoute === 'clientes') {
        openModal('Novo Cliente', `
            <form id="form-novo" onsubmit="submitForm(event, 'clientes')">
                <div class="form-group">
                    <label>Razão Social</label>
                    <input type="text" name="razao_social" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>CNPJ</label>
                    <input type="text" name="cnpj" oninput="maskCNPJ(this)" class="form-control" required placeholder="00.000.000/0000-00">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Telefone</label>
                    <input type="text" name="telefone" oninput="maskPhone(this)" class="form-control" required placeholder="(00) 00000-0000">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Salvar Cliente</button>
            </form>
        `);
    } else if (currentRoute === 'prestadores') {
        openModal('Novo Prestador', `
            <form id="form-novo" onsubmit="submitForm(event, 'prestadores')">
                <div class="form-group">
                    <label>Nome Completo</label>
                    <input type="text" name="nome" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>CPF/CNPJ</label>
                    <input type="text" name="cpf_cnpj" oninput="maskCPF_CNPJ(this)" class="form-control" required placeholder="000.000.000-00">
                </div>
                <div class="form-group">
                    <label>Especialidade / Serviço</label>
                    <input type="text" name="especialidade" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Telefone</label>
                    <input type="text" name="telefone" oninput="maskPhone(this)" class="form-control" required placeholder="(00) 00000-0000">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Salvar Prestador</button>
            </form>
        `);
    } else if (currentRoute === 'contratos') {
        const [resCli, resPrest] = await Promise.all([
            fetch(`${API_URL}/clientes`), fetch(`${API_URL}/prestadores`)
        ]);
        const clientes = await resCli.json();
        const prestadores = await resPrest.json();
        
        let cliOptions = clientes.map(c => `<option value="${c._id}">${c.razao_social}</option>`).join('');
        let prestOptions = prestadores.map(p => `<option value="${p._id}">${p.nome} (${p.especialidade})</option>`).join('');

        openModal('Novo Contrato', `
            <form id="form-novo" onsubmit="submitForm(event, 'contratos')">
                <div class="form-group">
                    <label>Cliente</label>
                    <select name="clienteId" class="form-control" required>${cliOptions}</select>
                </div>
                <div class="form-group">
                    <label>Prestador</label>
                    <select name="prestadorId" class="form-control" required>${prestOptions}</select>
                </div>
                <div class="form-group">
                    <label>Valor Acordado</label>
                    <input type="text" name="valor_acordado" oninput="maskCurrency(this)" placeholder="R$ 0,00" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Data de Início</label>
                    <input type="date" name="data_inicio" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Criar Contrato</button>
            </form>
        `);
    } else if (currentRoute === 'ordens') {
        const resCont = await fetch(`${API_URL}/contratos`);
        const contratos = await resCont.json();
        let contOptions = contratos.map(c => `<option value="${c._id}">${c.clienteId?.razao_social || 'Contrato'} - ${c.valor_acordado.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</option>`).join('');

        openModal('Nova Ordem de Serviço', `
            <form id="form-novo" onsubmit="submitForm(event, 'ordens-servico')">
                <div class="form-group">
                    <label>Contrato Vinculado</label>
                    <select name="contratoId" class="form-control" required>${contOptions}</select>
                </div>
                <div class="form-group">
                    <label>Descrição da Atividade</label>
                    <textarea name="descricao" class="form-control" rows="4" style="resize: vertical;" required></textarea>
                </div>
                <div class="form-group">
                    <label>Data de Execução</label>
                    <input type="date" name="data_execucao" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Registrar Ordem</button>
            </form>
        `);
    } else if (currentRoute === 'usuarios') {
        openModal('Novo Usuário do Sistema', `
            <form id="form-novo" onsubmit="submitForm(event, 'usuarios')">
                <div class="form-group">
                    <label>Nome de Usuário</label>
                    <input type="text" name="username" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Senha Inicial</label>
                    <input type="password" name="pass" class="form-control" required 
                           pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
                           title="A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Criar Usuário</button>
            </form>
        `);
    }
});

async function submitForm(event, endpoint, id = null) {
    event.preventDefault(); 
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validação rigorosa de máscaras
    if(data.razao_social && !/[a-zA-ZÀ-ÿ]/.test(data.razao_social)) {
        showAlert('A Razão Social ou Nome deve conter letras.');
        return;
    }
    if(data.nome && !/[a-zA-ZÀ-ÿ]/.test(data.nome)) {
        showAlert('O Nome deve conter letras.');
        return;
    }
    if(data.cnpj && data.cnpj.replace(/\\D/g, '').length !== 14) {
        showAlert('Por favor, preencha o CNPJ completo com 14 dígitos válidos.');
        return;
    }
    if(data.cpf_cnpj) {
        const cLen = data.cpf_cnpj.replace(/\\D/g, '').length;
        if(cLen !== 11 && cLen !== 14) {
            showAlert('Por favor, preencha o CPF (11 dígitos) ou CNPJ (14 dígitos) completo.');
            return;
        }
    }
    if(data.telefone && data.telefone.replace(/\\D/g, '').length < 10) {
        showAlert('Por favor, preencha o Telefone completo com DDD.');
        return;
    }

    // Remove máscara de dinheiro antes de mandar pro banco
    if(data.valor_acordado) {
        let valStr = data.valor_acordado.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
        let num = parseFloat(valStr);
        if(isNaN(num) || num <= 0) {
            showAlert('Por favor, insira um valor monetário válido e maior que zero.');
            return;
        }
        data.valor_acordado = num;
    }
    
    if(data.disponivel) data.disponivel = data.disponivel === 'true';

    if(endpoint === 'usuarios') {
        let users = window.getSystemUsers();
        if(id) {
            let u = users.find(x => x._id === id);
            if(u) u.pass = await hashPassword(data.pass);
        } else {
            if(users.find(u => u.username === data.username)) {
                showAlert('Este nome de usuário já existe!');
                return;
            }
            users.push({
                _id: 'u' + Date.now(),
                username: data.username,
                pass: await hashPassword(data.pass),
                status: 'ativo'
            });
        }
        localStorage.setItem('gvs_users', JSON.stringify(users));
        closeModal();
        renderRoute();
        return;
    }

    try {
        const btn = form.querySelector('button');
        btn.textContent = 'Salvando...';
        btn.disabled = true;

        const url = id ? `${API_URL}/${endpoint}/${id}` : `${API_URL}/${endpoint}`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const savedData = await response.json();
        
        if (!response.ok) {
            throw new Error(savedData.message || savedData.error || 'Erro ao comunicar com o servidor.');
        }

        // Salvar na auditoria com Detalhes
        const entityName = endpoint === 'ordens-servico' ? 'OrdemServico' : endpoint.charAt(0).toUpperCase() + endpoint.slice(1);
        const docId = id || savedData._id;
        if (docId) {
            await fetch(`${API_URL}/historico`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    acao: id ? 'atualizacao' : 'criacao',
                    entidade: entityName,
                    documentoId: docId,
                    detalhes: data
                })
            }).catch(e => console.log('Erro ao salvar auditoria', e));
        }
        
        closeModal();
        renderRoute(); 
    } catch (error) {
        showAlert(error.message);
        form.querySelector('button').disabled = false;
        form.querySelector('button').textContent = 'Tentar Novamente';
    }
}

// Funções de Perfil e Login
window.openConfigModal = function() {
    document.getElementById('user-dropdown').classList.remove('active');
    openModal('Alterar Senha de Administrador', `
        <form id="form-change-pass">
            <div class="form-group" style="text-align: left;">
                <label>Nova Senha</label>
                <input type="password" id="cfg-new-pass" class="form-control" required 
                       pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
                       title="A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial">
            </div>
            <div class="form-group" style="text-align: left; margin-bottom: 5px;">
                <label>Confirmar Nova Senha</label>
                <input type="password" id="cfg-confirm-pass" class="form-control" required 
                       pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
                       title="A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial">
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); text-align: left; margin-bottom: 15px;">
                Requisitos: Mín. 8 caracteres, 1 Maiúscula, 1 Número, 1 Caractere Especial (!@#$)
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Salvar Alterações</button>
        </form>
    `);

    document.getElementById('form-change-pass').addEventListener('submit', (e) => {
        e.preventDefault();
        const p1 = document.getElementById('cfg-new-pass').value;
        const p2 = document.getElementById('cfg-confirm-pass').value;
        if(p1 !== p2) {
            showAlert('As senhas não coincidem!');
            return;
        }
        localStorage.setItem('gvs_custom_pass', p1);
        showAlert('✅ Senha atualizada com sucesso no banco de dados!');
        closeModal();
    });
}

window.logout = function() {
    document.getElementById('user-dropdown').classList.remove('active');
    showConfirm('Tem certeza que deseja sair do painel de administração?', () => {
        localStorage.removeItem('gvs_auth');
        window.location.href = 'login.html';
    });
}
