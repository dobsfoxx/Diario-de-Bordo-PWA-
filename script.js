let entries = [];

function loadEntries() {
    const saved = localStorage.getItem('diary-entries');
    if (saved) {
        entries = JSON.parse(saved);
    }
}

function saveEntries() {
    localStorage.setItem('diary-entries', JSON.stringify(entries));
}

function showEntries() {
    const list = document.getElementById('list');
    const emptyList = document.getElementById('emptyList');
    
    if (entries.length === 0) {
        if (list) list.innerHTML = '';
        if (emptyList) emptyList.style.display = 'block';
        return;
    }
    
    if (emptyList) emptyList.style.display = 'none';
    if (list) {
        list.innerHTML = entries.map((entry, index) => `
            <div class="entry">
                <h3>${entry.title}</h3>
                <small>${entry.date}</small>
                <p>${entry.description}</p>
                <button onclick="deleteEntry(${index})">Excluir</button>
            </div>
        `).join('');
    }
}

function addEntry(title, date, description) {
    entries.push({ title, date, description });
    saveEntries();
    showEntries();
}

function deleteEntry(index) {
    entries.splice(index, 1);
    saveEntries();
    showEntries();
}

document.addEventListener('DOMContentLoaded', function() {
    loadEntries();
    showEntries();
    
    const form = document.getElementById('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('title').value.trim();
            const date = document.getElementById('date').value;
            const description = document.getElementById('description').value.trim();
            
            if (title && date && description) {
                addEntry(title, date, description);
                form.reset();
                alert('Anotação salva!');
            } else {
                alert('Preencha todos os campos!');
            }
        });
    }
});

// PWA Installation functionality
let deferredPrompt;
const installButton = document.getElementById('installButton');

// Captura o evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt disparado');
    // Previne o prompt automático
    e.preventDefault();
    // Salva o evento para usar depois
    deferredPrompt = e;
    // Mostra o botão de instalação
    if (installButton) {
        installButton.style.display = 'block';
    }
});

// Manipula o clique no botão de instalação
if (installButton) {
    installButton.addEventListener('click', async () => {
        if (!deferredPrompt) {
            alert('App já instalado ou não disponível para instalação');
            return;
        }
        
        // Mostra o prompt de instalação
        deferredPrompt.prompt();
        
        // Aguarda a escolha do usuário
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('Usuário aceitou instalar o PWA');
        } else {
            console.log('Usuário rejeitou instalar o PWA');
        }
        
        // Limpa o deferredPrompt
        deferredPrompt = null;
        // Esconde o botão
        installButton.style.display = 'none';
    });
}

// Detecta quando o app é instalado
window.addEventListener('appinstalled', (evt) => {
    console.log('PWA foi instalado com sucesso');
    // Esconde o botão de instalação
    if (installButton) {
        installButton.style.display = 'none';
    }
});
