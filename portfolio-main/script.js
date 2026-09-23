/* ==========================================================
   PORTFOLIO TEMPLATE: script.js

   This file adds small dynamic touches: things that happen
   because of user action or the passage of time, which HTML
   and CSS alone can't do.

   You don't need to edit anything in this file for the
   workshop — it works as soon as index.html loads it. Read
   through it anyway; each part is short and commented, and
   it's a good first look at how JavaScript reads and changes
   a page.

   Everything below waits for "DOMContentLoaded" — the moment
   the browser has finished reading index.html — before it
   touches the page. Without that, a script running before an
   element exists would find nothing there.
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  setFooterYear();
  highlightActiveNavLink();
  enableCopyEmailButton();
});


/* ==========================================================
   1. AUTO-UPDATING FOOTER YEAR
   The footer has <span id="year">2026</span>. Instead of
   students editing that number every January, we set it from
   the visitor's own computer clock.
   ========================================================== */
function setFooterYear() {
  const yearSpan = document.getElementById("year");
  if (!yearSpan) return; // page doesn't have the span — do nothing

  const currentYear = new Date().getFullYear();
  yearSpan.textContent = currentYear;
}


/* ==========================================================
   2. HIGHLIGHT THE NAV LINK FOR THE SECTION YOU'RE READING
   As you scroll past About, Projects, or Contact, this adds
   an "active" class to the matching link in the header so
   visitors can see where they are on the page.

   It uses an IntersectionObserver, which is the browser's
   built-in way of watching whether an element is on screen —
   much cheaper than checking scroll position by hand on every
   scroll event.
   ========================================================== */
function highlightActiveNavLink() {
  const sections = document.querySelectorAll("main [id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!sections.length || !navLinks.length) return;

  // Look up a section's nav link by id, e.g. "about" -> the <a href="#about">
  const linkFor = (id) =>
    document.querySelector(`.nav-links a[href="#${id}"]`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (!link) return;

        if (entry.isIntersecting) {
          navLinks.forEach((navLink) => navLink.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    {
      // Counts a section as "current" once it crosses the vertical
      // middle of the screen, not the moment its edge appears.
      rootMargin: "-50% 0px -50% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}


/* ==========================================================
   3. CLICK-TO-COPY EMAIL ADDRESS
   The Copy button next to the email link puts that address on
   the visitor's clipboard and shows "Copied!" for two seconds,
   so they don't have to carefully select the text themselves.
   ========================================================== */
function enableCopyEmailButton() {
  const copyButton = document.querySelector(".copy-button");
  if (!copyButton) return;

  const targetSelector = copyButton.dataset.copyTarget; // ".email"
  const emailLink = document.querySelector(targetSelector);
  if (!emailLink) return;

  copyButton.addEventListener("click", async () => {
    const emailAddress = emailLink.textContent.trim();

    try {
      await copyText(emailAddress);
      showCopyFeedback(copyButton, "Copied!");
    } catch (error) {
      // Clipboard access can fail (e.g. an older browser). Fall back
      // to just selecting the text so the visitor can copy it manually.
      console.error("Couldn't copy automatically:", error);
      selectText(emailLink);
      showCopyFeedback(copyButton, "Select + Ctrl/Cmd+C");
    }
  });
}

// Tries the modern Clipboard API first, and falls back to the older
// execCommand approach, which is what still works when a page is opened
// directly from a file (as this template is, before it's deployed).
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  tempInput.style.position = "fixed"; // keep it off-screen
  tempInput.style.opacity = "0";
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

function selectText(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function showCopyFeedback(button, message) {
  const originalText = button.textContent;
  button.textContent = message;
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 2000);
}
