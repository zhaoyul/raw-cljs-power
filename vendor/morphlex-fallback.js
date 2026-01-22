(function () {
  function captureFocus(container) {
    var active = document.activeElement;
    if (!active || !container.contains(active)) {
      return null;
    }
    return {
      id: active.id || null,
      name: active.name || null,
      value: typeof active.value === "string" ? active.value : null,
      selectionStart: active.selectionStart,
      selectionEnd: active.selectionEnd
    };
  }

  function restoreFocus(container, info) {
    if (!info) {
      return;
    }
    var target = null;
    if (info.id) {
      target = document.getElementById(info.id);
      if (target && !container.contains(target)) {
        target = null;
      }
    }
    if (!target && info.name) {
      try {
        target = container.querySelector('[name="' + info.name + '"]');
      } catch (e) {
        target = null;
      }
    }
    if (!target) {
      var inputs = container.querySelectorAll("input, textarea");
      if (inputs.length === 1) {
        target = inputs[0];
      }
    }
    if (!target) {
      return;
    }
    if (typeof info.value === "string" && "value" in target) {
      target.value = info.value;
    }
    if (typeof target.focus === "function") {
      try {
        target.focus({ preventScroll: true });
      } catch (e) {
        target.focus();
      }
    }
    if (typeof info.selectionStart === "number" && target.setSelectionRange) {
      try {
        target.setSelectionRange(info.selectionStart, info.selectionEnd);
      } catch (e) {
        // Ignore selection restore errors for unsupported inputs.
      }
    }
  }

  function fallbackMorph(container, html) {
    if (!container) {
      return;
    }
    var focusInfo = captureFocus(container);
    container.innerHTML = html;
    restoreFocus(container, focusInfo);
  }

  if (!window.morphlex) {
    window.morphlex = fallbackMorph;
  }
})();
