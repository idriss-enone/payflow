export function formatXAF(amount) {
  const sign = amount < 0 ? "-" : "";
  return `${sign}${new Intl.NumberFormat("fr-FR").format(Math.abs(Math.round(amount)))} FCFA`;
}

export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
export function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString("fr-FR", {
    day: "numeric",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


export function groupByDate(transactions, t) {
  const groups = [];
  let lastLabel = null;
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);


  for (const tx of transactions) {
    const date = new Date(tx.createdAt);
    let label;
    if (date.toDateString() === now.toDateString()) label = t("wallet.today");
    else if (date.toDateString() === yesterday.toDateString()) label = t("wallet.yesterday");
    else label = date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", });

    if (label !== lastLabel) {
      groups.push({ label, items: [] });
      lastLabel = label;
    }
    groups[groups.length - 1].items.push(tx);
  }
  return groups;
}