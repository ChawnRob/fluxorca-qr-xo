const config = {
  webhookUrl: "COLLE_TON_WEBHOOK_ICI",
};

function sendData(type, details = {}) {
  fetch(config.webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: type,
      details: details,
      timestamp: new Date().toISOString(),
    }),
  })
    .then(() => console.log("✅ Envoyé"))
    .catch((err) => console.error("❌ Erreur", err));
}
