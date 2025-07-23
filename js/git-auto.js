
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("select[data-module]").forEach(select => {
    const key = "estado_" + select.dataset.module;
    const saved = localStorage.getItem(key);
    if (saved) select.value = saved;

    select.addEventListener("change", () => {
      localStorage.setItem(key, select.value);
    });
  });
});
