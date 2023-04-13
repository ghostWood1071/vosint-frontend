export function downloadFile(csvData: Blob, filename: string) {
  const url = window.URL.createObjectURL(csvData instanceof Blob ? csvData : new Blob([csvData]));

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}
