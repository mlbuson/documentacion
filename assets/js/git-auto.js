
document.addEventListener("DOMContentLoaded", () => {
  const estados = document.querySelectorAll(".estado");
  const storageKey = "git-auto-status";

  function guardarEstados() {
    const data = {};
    estados.forEach(select => {
      const modulo = select.closest(".modulo").dataset.modulo;
      data[modulo] = select.value;
    });
    localStorage.setItem(storageKey, JSON.stringify(data));

    // también puede guardarse en git-auto.json si se desea servidor
    fetch("git-auto.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  estados.forEach(select => {
    select.addEventListener("change", guardarEstados);
  });

  // Cargar estados previos si existen
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const parsed = JSON.parse(saved);
    estados.forEach(select => {
      const modulo = select.closest(".modulo").dataset.modulo;
      if (parsed[modulo]) {
        select.value = parsed[modulo];
      }
    });
  }
});
