/**
 * Convert an array of objects to CSV string
 */
export function toCSV(data: Record<string, any>[], columns: { key: string; header: string }[]): string {
  const headers = columns.map(c => `"${c.header}"`).join(",");
  const rows = data.map(row =>
    columns.map(c => {
      const val = row[c.key];
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(",")
  );
  return [headers, ...rows].join("\n");
}

/**
 * Trigger a CSV file download in the browser
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
