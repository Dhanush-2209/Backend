import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoice(order) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ===== HEADER =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("MyStore", 14, 15); // Replace with your store name/logo
  doc.setFontSize(20);
  doc.text("INVOICE", pageWidth - 14, 15, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 14, 22, { align: "right" });

  doc.setDrawColor(200);
  doc.line(14, 25, pageWidth - 14, 25);

  // ===== ORDER SUMMARY + SHIPPING ADDRESS =====
  let yPos = 35;
  doc.setFont("helvetica", "bold");
  doc.text("Order Summary", 14, yPos);
  doc.text("Shipping Address", pageWidth / 2, yPos);

  doc.setFont("helvetica", "normal");
  yPos += 6;
  doc.text(`Order ID: ${order.id}`, 14, yPos);
  doc.text(`${order.address.name}`, pageWidth / 2, yPos);

  yPos += 6;
  doc.text(`Placed On: ${new Date(order.orderedTime).toLocaleDateString()} ${new Date(order.orderedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`, 14, yPos);
  doc.text(`${order.address.line}, ${order.address.city} - ${order.address.pincode}`, pageWidth / 2, yPos);

  yPos += 6;
  doc.text(`Status: ${order.status}`, 14, yPos);
  doc.text(`Phone: ${order.address.phone}`, pageWidth / 2, yPos);

  yPos += 6;
  doc.text(`Payment Method: ${order.paymentMethod?.method || "N/A"}`, 14, yPos);

  // ===== ITEMS TABLE =====
  const tableRows = order.items.map(item => [
    item.name,
    item.qty.toString(),
    `₹${item.price.toLocaleString()}`,
    `₹${(item.qty * item.price).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: yPos + 10,
    head: [["Item", "Qty", "Price", "Subtotal"]],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [95, 106, 242],
      textColor: 255,
      halign: "center",
      fontStyle: "bold"
    },
    bodyStyles: { fontSize: 11 },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" }
    },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // ===== TOTALS =====
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total Paid: ₹${order.total.toLocaleString()}`, pageWidth - 14, finalY, { align: "right" });

  // ===== FOOTER =====
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("Thank you for shopping with us!", pageWidth / 2, finalY + 20, { align: "center" });
  doc.text("For support, contact support@example.com", pageWidth / 2, finalY + 26, { align: "center" });

  doc.save(`Invoice_${order.id}.pdf`);
}
