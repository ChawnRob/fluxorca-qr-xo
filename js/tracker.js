/**
 * Fluxorca QR — Tracker v1.0
 */

const FLUXORCA_CONFIG = {
  webhookUrl: "https://hook.eu1.make.com/ih8f89mg66dyd38dm8qwbvm3h3tpofgz",
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbwa-V9eg1THEMb-UUZJCUNHmyzjK15UTU7qEqIC2zXSdWZ9IqbDZE1rDlCXI_CGt7P0/exec",
  debug: false,
};

// ─── SESSION ─────────────────────────────────────────────────────────────────

(function initSession() {
  const params = new URLSearchParams(window.location.search);
  const stored = JSON.parse(sessionStorage.getItem("fluxorca_session") || "{}");

  if (params.get("client")) stored.client = params.get("client");
  if (params.get("table"))  stored.table  = params.get("table");
  if (params.get("source")) stored.source = params.get("source");

  if (!stored.source) stored.source = "qr";

  sessionStorage.setItem("fluxorca_session", JSON.stringify(stored));
})();

function getSession() {
  return JSON.parse(sessionStorage.getItem("fluxorca_session") || "{}");
}

// ─── TRACKING ────────────────────────────────────────────────────────────────

function track(payload) {
  const session = getSession();
  const now = new Date();

  const data = {
    timestamp : now.toISOString(),
    date      : now.toLocaleDateString("fr-FR"),
    heure     : now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    client    : session.client || "inconnu",
    table     : session.table  || "",
    source    : session.source || "qr",
    choix     : payload.choix    || "",
    canal     : payload.canal    || "",
    motifs    : payload.motifs   || "",
    message   : payload.message  || "",
    page      : window.location.pathname.split("/").pop() || "index.html",
    user_agent: navigator.userAgent,
  };

  if (FLUXORCA_CONFIG.debug) {
    console.log("[Fluxorca tracker]", data);
  }

  const sends = [];

  if (FLUXORCA_CONFIG.webhookUrl) {
    sends.push(
      fetch(FLUXORCA_CONFIG.webhookUrl, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(data),
      }).catch((err) => {
        if (FLUXORCA_CONFIG.debug) console.warn("[Fluxorca] Make webhook échoué", err);
      })
    );
  }

  if (FLUXORCA_CONFIG.appsScriptUrl) {
    sends.push(
      fetch(FLUXORCA_CONFIG.appsScriptUrl, {
        method : "POST",
        body   : JSON.stringify(data),
      }).catch((err) => {
        if (FLUXORCA_CONFIG.debug) console.warn("[Fluxorca] Apps Script échoué", err);
      })
    );
  }

  return Promise.all(sends);
}

// ─── UTILITAIRES ─────────────────────────────────────────────────────────────

function injectSessionParams() {
  const session = getSession();
  const pairs = [];
  if (session.client) pairs.push("client=" + encodeURIComponent(session.client));
  if (session.table)  pairs.push("table="  + encodeURIComponent(session.table));
  if (session.source) pairs.push("source=" + encodeURIComponent(session.source));
  if (!pairs.length) return;

  const qs = pairs.join("&");

  document.querySelectorAll("a[href]").forEach(function(a) {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto")) return;
    const sep = href.includes("?") ? "&" : "?";
    a.setAttribute("href", href + sep + qs);
  });
}
