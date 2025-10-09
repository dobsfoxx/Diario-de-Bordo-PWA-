let entries = [];

function loadEntries() {
  const saved = localStorage.getItem("diary-entries");
  if (saved) {
    entries = JSON.parse(saved);
  }
}

function saveEntries() {
  localStorage.setItem("diary-entries", JSON.stringify(entries));
}

function showEntries() {
  const list = document.getElementById("list");
  const emptyList = document.getElementById("emptyList");

  if (entries.length === 0) {
    if (list) list.innerHTML = "";
    if (emptyList) emptyList.style.display = "block";
    return;
  }

  if (emptyList) emptyList.style.display = "none";
  if (list) {
    list.innerHTML = entries
      .map(
        (entry, index) => `
            <div class="entry">
                <h3>${entry.title}</h3>
                <small>${entry.date}</small>
                <p>${entry.description}</p>
                <button onclick="deleteEntry(${index})">Excluir</button>
            </div>
        `
      )
      .join("");
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

document.addEventListener("DOMContentLoaded", function () {
  loadEntries();
  showEntries();

  const form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("title").value.trim();
      const date = document.getElementById("date").value;
      const description = document.getElementById("description").value.trim();

      if (title && date && description) {
        addEntry(title, date, description);
        form.reset();
        alert("Anotação salva!");
      } else {
        alert("Preencha todos os campos!");
      }
    });
  }
});

let deferredPrompt;
const installButton = document.getElementById("installButton");

window.addEventListener("beforeinstallprompt", (e) => {

  e.preventDefault();

  deferredPrompt = e;

  if (installButton) {
    installButton.style.display = "block";
  }
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js')
      .then(function(reg) {
        console.log('Service worker registrado com sucesso:', reg.scope);
      }).catch(function(err) {
        console.warn('Falha ao registrar service worker:', err);
      });
  });
}
