import jsPDF from "jspdf";

export const generateInvoicePDF = (invoice, patientName, totalPaid) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Kalrav Speech Therapy Clinic", 20, 20);

  doc.setFontSize(12);
  doc.text(`Patient: ${patientName}`, 20, 40);
  doc.text(`Total Amount: ₹${invoice.amount}`, 20, 50);
  doc.text(`Paid Amount: ₹${totalPaid}`, 20, 60);
  doc.text(`Status: ${invoice.status}`, 20, 70);

  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 90);

  doc.save(`invoice-${invoice.id}.pdf`);
};