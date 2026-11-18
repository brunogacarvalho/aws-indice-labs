let allLabs = [];
let extraLabs = [];
let activeFilter = "Todos";

const labList = document.querySelector("#lab-list");
const extraList = document.querySelector("#extra-list");
const searchInput = document.querySelector("#search");
const emptyState = document.querySelector("#empty-state");

function createLabItem(item) {
  const article = document.createElement("article");
  article.className = "lab-item";

  const title = document.createElement("h3");
  title.textContent = `${item.number} - ${item.title}`;

  const description = document.createElement("p");
  description.className = "lab-description";
  description.textContent = item.description;

  const links = document.createElement("div");
  links.className = "lab-links";

  if (item.repository) {
    links.append(createLink(item.repository, "Repositório GitHub ↗"));
  } else {
    links.append(createDisabled("Repositório a cadastrar"));
  }

  if (item.page) {
    links.append(createLink(item.page, "Página ↗"));
  } else {
    links.append(createDisabled("Página a cadastrar"));
  }

  article.append(title, description, links);
  return article;
}

function createLink(url, label) {
  const link = document.createElement("a");
  link.href = url;
  link.textContent = label;
  link.target = "_blank";
  link.rel = "noreferrer";
  return link;
}

function createDisabled(label) {
  const span = document.createElement("span");
  span.className = "disabled";
  span.textContent = label;
  return span;
}

function matchesSearch(item, query) {
  const content = [
    item.number,
    item.title,
    item.service,
    item.category,
    item.description
  ].join(" ").toLocaleLowerCase("pt-BR");

  return content.includes(query);
}

function render() {
  const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");

  const filteredLabs = allLabs.filter(item => {
    const matchesCategory =
      activeFilter === "Todos" || item.category === activeFilter;

    return matchesCategory && matchesSearch(item, query);
  });

  const filteredExtras = extraLabs.filter(item =>
    matchesSearch(item, query)
  );

  labList.replaceChildren(...filteredLabs.map(createLabItem));
  extraList.replaceChildren(...filteredExtras.map(createLabItem));

  emptyState.hidden =
    filteredLabs.length > 0 || filteredExtras.length > 0;

  document.querySelector("#extras").hidden = filteredExtras.length === 0;
}

fetch("data/labs.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Não foi possível carregar os dados do catálogo.");
    }
    return response.json();
  })
  .then(data => {
    allLabs = data.labs || [];
    extraLabs = data.extras || [];
    render();
  })
  .catch(error => {
    labList.textContent = error.message;
  });

searchInput.addEventListener("input", render);

document.querySelector("#filters").addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;

  activeFilter = button.dataset.filter;

  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  render();
});

// Alternância entre modo escuro e claro
const themeToggle = document.querySelector("#theme-toggle");

themeToggle.addEventListener("click", () => {
  const isDark = document.body.dataset.theme === "dark";

  document.body.dataset.theme = isDark ? "light" : "dark";
  themeToggle.textContent = isDark ? "☾ Modo escuro" : "☀ Modo claro";
});
