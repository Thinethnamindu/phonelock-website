document.documentElement.classList.add("js-motion");

const year = document.getElementById("current-year");
if (year) year.textContent = String(new Date().getFullYear());

const letterMotionObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle("is-text-visible", entry.isIntersecting);
    }
  }, { threshold: 0.12 })
  : null;

function prepareLetterMotion(root) {
  const excludedParents = "script, style, noscript, textarea, input, select, option, svg, .sr-only";
  const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!node.textContent.trim() || !parent || parent.closest(excludedParents) || parent.closest(".letter-motion-run")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const textNodes = [];
  while (textWalker.nextNode()) textNodes.push(textWalker.currentNode);

  for (const textNode of textNodes) {
    const originalText = textNode.textContent;
    const run = document.createElement("span");
    const tokens = originalText.match(/\s+|[^\s]+/g) || [];
    run.className = "letter-motion-run";
    run.setAttribute("role", "text");
    run.setAttribute("aria-label", originalText);
    for (const token of tokens) {
      if (/^\s+$/.test(token)) {
        run.append(document.createTextNode(token));
        continue;
      }

      const word = document.createElement("span");
      word.className = "letter-motion-word";
      let wordLetterIndex = 0;
      for (const character of token) {
        const letter = document.createElement("span");
        letter.className = "letter-motion-character";
        letter.setAttribute("aria-hidden", "true");
        letter.style.setProperty("--letter-delay", `${wordLetterIndex * 7}ms`);
        letter.textContent = character;
        word.append(letter);
        wordLetterIndex += 1;
      }
      run.append(word);
      if (letterMotionObserver) {
        letterMotionObserver.observe(word);
      } else {
        word.classList.add("is-text-visible");
      }
    }
    textNode.replaceWith(run);
  }
}

prepareLetterMotion(document.body);

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.getElementById("primary-nav");

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    menuButton.querySelector(".sr-only").textContent = "Open menu";
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
    menuButton.querySelector(".sr-only").textContent = isOpen ? "Open menu" : "Close menu";
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const copyStatus = document.getElementById("copy-status");
const setCopyStatus = (message, state) => {
  if (!copyStatus) return;
  copyStatus.textContent = message;
  copyStatus.classList.toggle("is-error", state === "error");
  copyStatus.classList.toggle("is-success", state === "success");
  prepareLetterMotion(copyStatus);
};

async function copyValue(value) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch (error) {
      // Fall through to the local selection-based copy for browsers that block clipboard access.
    }
  }

  const temporaryField = document.createElement("textarea");
  temporaryField.value = value;
  temporaryField.setAttribute("readonly", "");
  temporaryField.style.position = "fixed";
  temporaryField.style.opacity = "0";
  document.body.appendChild(temporaryField);
  temporaryField.select();
  const copied = document.execCommand("copy");
  temporaryField.remove();
  if (!copied) throw new Error("Clipboard copy was blocked");
}

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    const value = target && "value" in target ? target.value.trim() : "";
    if (!value) {
      setCopyStatus("Enter a value first, then try copying again.", "error");
      if (target) target.focus();
      return;
    }

    try {
      await copyValue(value);
      setCopyStatus("Copied to clipboard. The value stays in this browser.", "success");
      button.classList.add("copied");
      const originalLabel = button.textContent;
      button.textContent = "Copied";
      prepareLetterMotion(button);
      window.setTimeout(() => {
        button.textContent = originalLabel;
        button.classList.remove("copied");
        prepareLetterMotion(button);
      }, 1600);
    } catch (error) {
      setCopyStatus("Copy was blocked. Select the value and copy it manually.", "error");
    }
  });
});

const revealButton = document.querySelector(".reveal-button");
const apiKeyField = document.getElementById("firebase-api-key");
if (revealButton && apiKeyField) {
  revealButton.addEventListener("click", () => {
    const reveal = apiKeyField.type === "password";
    apiKeyField.type = reveal ? "text" : "password";
    revealButton.setAttribute("aria-pressed", String(reveal));
    revealButton.setAttribute("aria-label", reveal ? "Hide API key" : "Show API key");
    revealButton.textContent = reveal ? "Hide" : "Show";
    prepareLetterMotion(revealButton);
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.14, rootMargin: "0px 0px -24px 0px" });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
