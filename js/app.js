let allLabs = [];
let extraLabs = [];
let activeFilter = "Todos";

const labList = document.querySelector("#lab-list");
const extraList = document.querySelector("#extra-list");
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
  span.className = "link-disabled";
  span.textContent = label;
  return span;
}

function render() {
  const filteredLabs = allLabs.filter(item =>
    activeFilter === "Todos" || item.category === activeFilter
  );

  const filteredExtras = extraLabs.filter(item =>
    activeFilter === "Todos" || item.category === activeFilter
  );

  labList.replaceChildren(...filteredLabs.map(createLabItem));
  extraList.replaceChildren(...filteredExtras.map(createLabItem));

  emptyState.hidden = filteredLabs.length > 0;
  document.querySelector("#extras").hidden = filteredExtras.length === 0;
}

fetch("data/labs.json")
  .then(response => {
    if (!response.ok) throw new Error("Não foi possível carregar os laboratórios.");
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

document.querySelector("#filters").addEventListener("click", event => {
  const button = event.target.closest(".filter");
  if (!button) return;

  activeFilter = button.dataset.filter;

  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  render();
});

const themeToggle = document.querySelector("#theme-toggle");

themeToggle.addEventListener("click", () => {
  const currentTheme = document.body.dataset.theme;
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.body.dataset.theme = newTheme;
  themeToggle.textContent = newTheme === "dark" ? "☀" : "☾";
});
