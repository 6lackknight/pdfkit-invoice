const fs = require("fs");
const PDFDocument = require("pdfkit");


function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("logo.png", 50, 45, { width: 120, height: 30 })
    .text(company.name, 200, 50, { align: "right" })
    .font("Helvetica")
    .text(company.address1, 200, 65, { align: "right" })
    .text(company.address2, 200, 80, { align: "right" })
    .text(company.address3, 200, 95, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  invoice.customer = customer;
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 140);

  generateHr(doc, 165);

  const customerInformationTop = 180;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(invoice.subtotal - invoice.paid),
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(invoice.customer.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.customer.address2, 300, customerInformationTop + 15)
    .text(
      invoice.customer.address3,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 242);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 280;

  doc.font("Helvetica-Bold");

  generateTableRow(
    doc,
    invoiceTableTop,
    "Date",
    // "Employee",
    "Advance ID",
    "Amount",
    "Fees",
    "Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];

    let position = invoiceTableTop + (i + 1) * 30;

    if (position > 680) {
      position = invoiceTableTop;
      doc.addPage();
      doc.font("Helvetica-Bold");

      generateTableRow(
        doc,
        invoiceTableTop,
        "Date",
        // "Employee",
        "Advance ID",
        "Amount",
        "Fees",
        "Total"
      );
      generateHr(doc, 80);
    }

    generateTableRow(
      doc,
      position,
      item.$createdAt.substring(0, 10),
      // item.name,
      item.$id,
      formatCurrency(item.amount),
      formatCurrency(item.fees),
      formatCurrency(item.total)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  generateHr(doc, 700);

  doc
    .fontSize(10)
    .text(company.address1, 50, 726, { align: "left" })
    .text(company.address1, 50, 740, { align: "left" })
    .text(company.address2, 50, 754, { align: "left" })
    .text(company.address3, 50, 768, { align: "left" })
    .font("Helvetica-Bold")
    .text("Banking Details:", 50, 712, { align: "left" });

}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "R" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice
};
