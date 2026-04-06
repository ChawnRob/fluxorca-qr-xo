const config = {
  webhookUrl: "https://hook.eu1.make.com/ih8f89mg66dyd38dm8qwbvm3h3tpofgz",
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
