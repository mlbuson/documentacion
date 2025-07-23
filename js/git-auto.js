
document.addEventListener("DOMContentLoaded", () => {
  const estados = document.querySelectorAll("select[data-module]");
  const checkboxes = document.querySelectorAll("input[type='checkbox'][data-env]");

  function actualizarEstadoVisual(module, value) {
    const badge = document.querySelector(`.card[data-module='${module}'] .status`);
    if (!badge) return;

    badge.className = 'status'; // Reset classes
    switch(value) {
      case 'Actualiza':
        badge.classList.add('actualiza');
        badge.innerHTML = '<i class="fas fa-arrow-up"></i> Despliegue nueva versión';
        break;
      case 'No actualiza':
        badge.classList.add('no-actualiza');
        badge.innerHTML = '<i class="fas fa-ban"></i> No se actualiza';
        break;
      case 'Se stopea':
        badge.classList.add('stopea');
        badge.innerHTML = '<i class="fas fa-stop-circle"></i> Solo detener servicio';
        break;
    }
  }

  // Restaurar valores
  estados.forEach(sel => {
    const mod = sel.dataset.module;
    const saved = localStorage.getItem("estado_" + mod);
    if (saved) {
      sel.value = saved;
      actualizarEstadoVisual(mod, saved);
    } else {
      actualizarEstadoVisual(mod, sel.value);
    }

    sel.addEventListener("change", () => {
      localStorage.setItem("estado_" + mod, sel.value);
      actualizarEstadoVisual(mod, sel.value);
    });
  });

  checkboxes.forEach(chk => {
    const env = chk.dataset.env;
    const saved = localStorage.getItem("env_" + env);
    if (saved !== null) chk.checked = saved === "true";

    chk.addEventListener("change", () => {
      localStorage.setItem("env_" + env, chk.checked);
    });
  });

  document.getElementById("guardar-btn").addEventListener("click", () => {
    alert("Cambios guardados correctamente.");
  });
});
