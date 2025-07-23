
document.addEventListener("DOMContentLoaded", () => {
  const estados = document.querySelectorAll("select[data-module]");
  const checkboxes = document.querySelectorAll("input[type='checkbox'][data-env]");

  // Restaurar estados guardados
  estados.forEach(sel => {
    const saved = localStorage.getItem("estado_" + sel.dataset.module);
    if (saved) sel.value = saved;
  });

  checkboxes.forEach(chk => {
    const saved = localStorage.getItem("env_" + chk.dataset.env);
    if (saved !== null) chk.checked = saved === "true";
  });

  // Guardar al hacer clic
  document.getElementById("guardar-btn").addEventListener("click", () => {
    estados.forEach(sel => {
      localStorage.setItem("estado_" + sel.dataset.module, sel.value);
    });
    checkboxes.forEach(chk => {
      localStorage.setItem("env_" + chk.dataset.env, chk.checked);
    });
    alert("Cambios guardados correctamente.");
  });
});
