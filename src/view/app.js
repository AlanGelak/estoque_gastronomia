const API_URL = "http://localhost:8001";

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.borderColor = isError ? "#b91c1c" : "#4b5563";
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

async function fetchJson(path, options = {}) {
  const response = await fetch(API_URL + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Erro HTTP ${response.status}`);
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function format2(num) {
  return Number(num || 0).toFixed(2);
}

/* ============================================================
   ESTOQUE LATERAL
============================================================ */
async function carregarEstoqueSidebar() {
  try {
    const ingredientes = await fetchJson("/ingredientes");
    const lista = document.getElementById("lista-estoque");
    lista.innerHTML = "";

    for (const ingrediente of ingredientes) {
      const saldo = await fetchJson(`/estoque/saldo/${ingrediente.id}`);
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${ingrediente.nome}</span>
        <span>${format2(saldo.saldo)} ${ingrediente.unidade}</span>
      `;
      lista.appendChild(li);
    }
  } catch (err) {
    showToast("Erro ao carregar estoque: " + err.message, true);
  }
}

/* ============================================================
   COMBOS / SELECTS
============================================================ */
let cacheIngredientes = [];
let cachePratos = [];

async function atualizarCombosBasicos() {
  cacheIngredientes = await fetchJson("/ingredientes");
  cachePratos = await fetchJson("/pratos");

  // selects de ingrediente
  const selIng = document.getElementById("select-ingrediente");
  const selIngEntrada = document.getElementById("select-ingrediente-entrada");
  const selIngReceita = document.getElementById("select-ingrediente-receita");

  const allIngSelects = [selIng, selIngEntrada, selIngReceita];
  allIngSelects.forEach((select) => {
    if (!select) return;
    select.innerHTML = "";
    cacheIngredientes.forEach((ing) => {
      const opt = document.createElement("option");
      opt.value = ing.id;
      opt.textContent = `${ing.nome} (${ing.unidade})`;
      select.appendChild(opt);
    });
  });

  // selects de prato
  const selPrato = document.getElementById("select-prato");
  const selPratoReceita = document.getElementById("select-prato-receita");
  const selPratoReceitaLista = document.getElementById("select-prato-receita-lista");

  const allPratoSelects = [selPrato, selPratoReceita, selPratoReceitaLista];
  allPratoSelects.forEach((select) => {
    if (!select) return;
    select.innerHTML = "";
    cachePratos.forEach((prato) => {
      const opt = document.createElement("option");
      opt.value = prato.id;
      opt.textContent = prato.nome;
      select.appendChild(opt);
    });
  });

  if (selPratoReceitaLista) {
    carregarReceitaTabela();
  }
}

/* ============================================================
   REQUISIÇÃO DE INGREDIENTES
============================================================ */
function configurarFormRequisicaoIngrediente() {
  const form = document.getElementById("form-requisicao-ingrediente");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const codIngrediente = Number(document.getElementById("select-ingrediente").value);
    const quantidade = Number(document.getElementById("input-qtd-ingrediente").value);
    const motivo =
      document.getElementById("input-motivo-ingrediente").value ||
      "Retirada manual";

    try {
      await fetchJson("/estoque", {
        method: "POST",
        body: JSON.stringify({
          codIngrediente,
          quantidade,
          tipo: "saida",
          motivo,
        }),
      });
      showToast("Retirada registrada com sucesso!");
      form.reset();
      atualizarCombosBasicos();
      carregarEstoqueSidebar();
    } catch (err) {
      showToast("Erro na retirada: " + err.message, true);
    }
  });
}

/* ============================================================
   REQUISIÇÃO DE PRATOS (vendas)
============================================================ */
function configurarFormRequisicaoPrato() {
  const form = document.getElementById("form-requisicao-prato");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const idPrato = Number(document.getElementById("select-prato").value);
    const quantidadePratos = Number(document.getElementById("input-qtd-prato").value);

    try {
      // jeito simples: chama /vendas/:idPrato N vezes
      for (let i = 0; i < quantidadePratos; i++) {
        await fetchJson(`/vendas/${idPrato}`, { method: "POST", body: JSON.stringify({}) });
      }
      showToast("Venda registrada e estoque atualizado!");
      carregarEstoqueSidebar();
    } catch (err) {
      showToast("Erro ao registrar venda: " + err.message, true);
    }
  });
}

/* ============================================================
   CRUD CATEGORIAS
============================================================ */
async function carregarCategorias() {
  const categorias = await fetchJson("/categorias");
  const tbody = document.querySelector("#tabela-categorias tbody");
  tbody.innerHTML = "";

  categorias.forEach((cat) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cat.id}</td>
      <td>${cat.nome}</td>
      <td>
        <button class="btn-sm-secondary" data-acao="editar" data-id="${cat.id}">Editar</button>
        <button class="btn-sm-danger" data-acao="excluir" data-id="${cat.id}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.onclick = async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;
    const acao = btn.dataset.acao;

    if (acao === "excluir") {
      if (!confirm("Excluir categoria?")) return;
      await fetchJson(`/categorias/${id}`, { method: "DELETE" });
      showToast("Categoria excluída.");
      carregarCategorias();
    }

    if (acao === "editar") {
      const novoNome = prompt("Novo nome da categoria:");
      if (!novoNome) return;
      await fetchJson(`/categorias/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nome: novoNome }),
      });
      showToast("Categoria atualizada.");
      carregarCategorias();
    }
  };
}

function configurarFormCategoria() {
  const form = document.getElementById("form-categoria");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("input-categoria-nome").value;
    await fetchJson("/categorias", {
      method: "POST",
      body: JSON.stringify({ nome }),
    });
    form.reset();
    showToast("Categoria adicionada.");
    carregarCategorias();
  });
}

/* ============================================================
   CRUD INGREDIENTES
============================================================ */
async function carregarIngredientesTabela() {
  const tbody = document.querySelector("#tabela-ingredientes tbody");
  tbody.innerHTML = "";
  cacheIngredientes = await fetchJson("/ingredientes");

  cacheIngredientes.forEach((ing) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ing.id}</td>
      <td>${ing.nome}</td>
      <td>${ing.unidade}</td>
      <td>
        <button class="btn-sm-secondary" data-acao="editar" data-id="${ing.id}">Editar</button>
        <button class="btn-sm-danger" data-acao="excluir" data-id="${ing.id}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.onclick = async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;
    const acao = btn.dataset.acao;

    if (acao === "excluir") {
      if (!confirm("Excluir ingrediente?")) return;
      await fetchJson(`/ingredientes/${id}`, { method: "DELETE" });
      showToast("Ingrediente excluído.");
      carregarIngredientesTabela();
      atualizarCombosBasicos();
      carregarEstoqueSidebar();
    }

    if (acao === "editar") {
      const novoNome = prompt("Novo Nome do ingrediente:");
      if (!novoNome) return;
      const novaUnidade = prompt("Nova unidade (g, ml, un...):");
      if (!novaUnidade) return;

      await fetchJson(`/ingredientes/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nome: novoNome, unidade: novaUnidade }),
      });
      showToast("Ingrediente atualizado.");
      carregarIngredientesTabela();
      atualizarCombosBasicos();
    }
  };
}

function configurarFormIngrediente() {
  const form = document.getElementById("form-ingrediente");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("input-ingrediente-nome").value;
    const unidade = document.getElementById("input-ingrediente-unidade").value;

    await fetchJson("/ingredientes", {
      method: "POST",
      body: JSON.stringify({ nome, unidade }),
    });

    form.reset();
    showToast("Ingrediente adicionado.");
    carregarIngredientesTabela();
    atualizarCombosBasicos();
  });
}

/* ============================================================
   CRUD PRATOS
============================================================ */
async function carregarPratosTabela() {
  const tbody = document.querySelector("#tabela-pratos tbody");
  tbody.innerHTML = "";
  cachePratos = await fetchJson("/pratos");

  cachePratos.forEach((prato) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prato.id}</td>
      <td>${prato.nome}</td>
      <td>R$ ${format2(prato.preco)}</td>
      <td>
        <button class="btn-sm-secondary" data-acao="editar" data-id="${prato.id}">Editar</button>
        <button class="btn-sm-danger" data-acao="excluir" data-id="${prato.id}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.onclick = async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;
    const acao = btn.dataset.acao;

    if (acao === "excluir") {
      if (!confirm("Excluir prato?")) return;
      await fetchJson(`/pratos/${id}`, { method: "DELETE" });
      showToast("Prato excluído.");
      carregarPratosTabela();
      atualizarCombosBasicos();
    }
    if (acao === "editar") {
      const pratoAtual = cachePratos.find(p => p.id == id);

      const novoNome = prompt("Novo nome do prato:", pratoAtual.nome);
      if (novoNome === null) return;

      const precoStr = prompt(
        "Novo preço (ex: 29.90):",
        pratoAtual.preco
      );
      if (precoStr === null) return;

      const novoPreco = Number(precoStr.replace(",", "."));
      if (isNaN(novoPreco)) {
        showToast("Preço inválido.", true);
        return;
      }

      await fetchJson(`/pratos/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          nome: novoNome,
          preco: novoPreco,
        }),
      });

      showToast("Prato atualizado.");
      carregarPratosTabela();
      atualizarCombosBasicos();
    }
  } 
}

function configurarFormPrato() {
  const form = document.getElementById("form-prato");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("input-prato-nome").value;
    const preco = Number(document.getElementById("input-prato-preco").value);

    await fetchJson("/pratos", {
      method: "POST",
      body: JSON.stringify({ nome, preco }),
    });

    form.reset();
    showToast("Prato adicionado.");
    carregarPratosTabela();
    atualizarCombosBasicos();
  });
}

/* ============================================================
   ENTRADA DE ESTOQUE
============================================================ */
function configurarFormEntradaEstoque() {
  const form = document.getElementById("form-entrada-estoque");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const codIngrediente = Number(
      document.getElementById("select-ingrediente-entrada").value
    );
    const quantidade = Number(document.getElementById("input-qtd-entrada").value);
    const motivo =
      document.getElementById("input-motivo-entrada").value || "Entrada manual";

    await fetchJson("/estoque", {
      method: "POST",
      body: JSON.stringify({
        codIngrediente,
        quantidade,
        tipo: "entrada",
        motivo,
      }),
    });

    showToast("Entrada registrada.");
    form.reset();
    carregarEstoqueSidebar();
  });
}

/* ============================================================
   RECEITAS
============================================================ */
function configurarFormReceita() {
  const form = document.getElementById("form-receita");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const codPrato = Number(document.getElementById("select-prato-receita").value);
    const codIngrediente = Number(
      document.getElementById("select-ingrediente-receita").value
    );
    const quantidade = Number(document.getElementById("input-qtd-receita").value);

    await fetchJson("/receitas", {
      method: "POST",
      body: JSON.stringify({ codPrato, codIngrediente, quantidade }),
    });

    showToast("Item adicionado à receita.");
    carregarReceitaTabela();
  });
}

async function carregarReceitaTabela() {
  const selectPrato = document.getElementById("select-prato-receita-lista");
  if (!selectPrato || !selectPrato.value) return;
  const idPrato = selectPrato.value;

  const itens = await fetchJson(`/receitas/${idPrato}`);
  const tbody = document.querySelector("#tabela-receita tbody");
  tbody.innerHTML = "";

  itens.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.ingrediente}</td>
      <td>${format2(item.quantidade)}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ============================================================
   TABS
============================================================ */
function configurarTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      const id = tab.dataset.tab;
      document.getElementById(id).classList.add("active");
    });
  });
}

/* ============================================================
   INICIALIZAÇÃO
============================================================ */
window.addEventListener("DOMContentLoaded", async () => {
  configurarTabs();

  configurarFormRequisicaoIngrediente();
  configurarFormRequisicaoPrato();
  configurarFormCategoria();
  configurarFormIngrediente();
  configurarFormPrato();
  configurarFormEntradaEstoque();
  configurarFormReceita();

  document
    .getElementById("select-prato-receita-lista")
    ?.addEventListener("change", carregarReceitaTabela);

  document
    .getElementById("btn-atualizar-estoque")
    .addEventListener("click", carregarEstoqueSidebar);

  await atualizarCombosBasicos();
  await carregarEstoqueSidebar();
  await carregarCategorias();
  await carregarIngredientesTabela();
  await carregarPratosTabela();
  await carregarReceitaTabela();
});
