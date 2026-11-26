
"use strict";

(function () {
  const overlay = document.getElementById("help-overlay");
  const openButton = document.getElementById("help-button");
  const closeButton = document.getElementById("help-close");
  const doneButton = document.getElementById("help-done");

  if (!overlay || !openButton || !closeButton || !doneButton) {
    console.error("Help window elements are missing.");
    return;
  }

  let previousFocus = null;

  function openHelp() {
    previousFocus = document.activeElement;
    overlay.hidden = false;
    closeButton.focus();
  }

  function closeHelp() {
    overlay.hidden = true;

    if (
      previousFocus &&
      typeof previousFocus.focus === "function"
    ) {
      previousFocus.focus();
    }
  }

  openButton.addEventListener("click", openHelp);
  closeButton.addEventListener("click", closeHelp);
  doneButton.addEventListener("click", closeHelp);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeHelp();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (overlay.hidden) return;

    if (event.key === "Escape") {
      closeHelp();
    }

    if (event.key === "Tab") {
      const focusables = [closeButton, doneButton];
      const current = focusables.indexOf(document.activeElement);

      if (event.shiftKey && current <= 0) {
        event.preventDefault();
        doneButton.focus();
      } else if (!event.shiftKey && current === focusables.length - 1) {
        event.preventDefault();
        closeButton.focus();
      }
    }
  });
})();
