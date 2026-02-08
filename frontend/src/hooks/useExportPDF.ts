/**
 * Hook customizado para gerenciar a exportação de relatórios em PDF.
 * Lida com a geração de canvas e download do arquivo, incluindo feedback de erro.
 */
import { useState } from "react";

const EXPORT_ERROR_MESSAGE = "Não foi possível gerar o PDF. Tente novamente.";

export function useExportPDF() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportReport = async (element: HTMLElement) => {
    if (isExporting) return;
    setIsExporting(true);

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "794px"; // A4 width in pixels at 96dpi
    iframe.style.height = "1123px"; // A4 height in pixels at 96dpi
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    if (!doc) {
      document.body.removeChild(iframe);
      setIsExporting(false);
      return;
    }

    doc.open();
    doc.write("<!doctype html><html><head><style>body{margin:0;background:#fff;font-family:Arial,Helvetica,sans-serif;}</style></head><body></body></html>");
    doc.close();

    const clone = element.cloneNode(true) as HTMLDivElement;
    clone.style.position = "static";
    clone.style.left = "0";
    clone.style.top = "0";
    clone.style.width = "794px";
    clone.style.minHeight = "1123px";
    clone.style.background = "#ffffff";
    clone.style.display = "block";
    doc.body.appendChild(clone);

    // Aguarda fontes e renderização
    if (doc.fonts?.ready) {
      await doc.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        width: clone.scrollWidth,
        height: clone.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      let imgWidth = pageWidth - margin * 2;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight - margin * 2) {
        imgHeight = pageHeight - margin * 2;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight, undefined, "FAST");
      pdf.save("relatorio-arkar.pdf");
    } catch (err) {
      console.error("Erro ao exportar PDF:", err);
      setExportError(EXPORT_ERROR_MESSAGE);
    } finally {
      document.body.removeChild(iframe);
      setIsExporting(false);
    }
  };

  const clearExportError = () => setExportError(null);

  return { isExporting, exportError, clearExportError, exportReport };
}
