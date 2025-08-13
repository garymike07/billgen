document.addEventListener("DOMContentLoaded", () => {
    const companyNameInput = document.getElementById("companyName");
    const clientNameInput = document.getElementById("clientName");
    const invoiceNumberInput = document.getElementById("invoiceNumber");
    const invoiceDateInput = document.getElementById("invoiceDate");
    const logoUploadInput = document.getElementById("logoUpload");
    const logoPreview = document.getElementById("logoPreview");
    const templateSelect = document.getElementById("templateSelect");
    const generatePdfBtn = document.getElementById("generatePdf");
    const invoicePreview = document.getElementById("invoicePreview");
    const addItemBtn = document.getElementById("addItemBtn");
    const itemRowsContainer = document.getElementById("item-rows");

    let logoDataUrl = null;

    const updateInvoicePreview = () => {
        const companyName = companyNameInput.value;
        const clientName = clientNameInput.value;
        const invoiceNumber = invoiceNumberInput.value;
        const invoiceDate = invoiceDateInput.value;
        const selectedTemplate = templateSelect.value;

        invoicePreview.className = `invoice-template ${selectedTemplate}`;

        let logoHtml = "";
        if (logoDataUrl) {
            logoHtml = `<img src="${logoDataUrl}" alt="Company Logo">`;
        }

        let itemsHtml = "";
        let totalAmount = 0;
        const itemRows = itemRowsContainer.querySelectorAll(".item-row");

        itemRows.forEach(row => {
            const description = row.querySelector(".item-description").value;
            const quantity = parseFloat(row.querySelector(".item-quantity").value) || 0;
            const rate = parseFloat(row.querySelector(".item-rate").value) || 0;
            const amount = quantity * rate;
            totalAmount += amount;

            itemsHtml += `
                <tr>
                    <td>${description || "Item"}</td>
                    <td>${quantity}</td>
                    <td>${rate.toFixed(2)}</td>
                    <td>${amount.toFixed(2)}</td>
                </tr>
            `;
        });

        if (itemRows.length === 0) {
            itemsHtml = `
                <tr>
                    <td colspan="4">No items added.</td>
                </tr>
            `;
        }

        invoicePreview.innerHTML = `
            <div class="header">
                ${logoHtml}
                <h1>Invoice</h1>
            </div>
            <div class="info">
                <p><strong>Invoice No:</strong> ${invoiceNumber || "[Invoice Number]"}</p>
                <p><strong>Date:</strong> ${invoiceDate || "[Invoice Date]"}</p>
            </div>
            <div class="bill-to">
                <h2>Bill To:</h2>
                <p>${clientName || "[Client Name]"}</p>
            </div>
            <div class="bill-from">
                <h2>From:</h2>
                <p>${companyName || "[Company Name]"}</p>
            </div>
            <div class="items">
                <h3>Items:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
            </div>
            <div class="total">
                <p><strong>Total:</strong> $${totalAmount.toFixed(2)}</p>
            </div>
        `;
    };

    const addItemRow = () => {
        const itemRow = document.createElement("div");
        itemRow.classList.add("item-row");
        itemRow.innerHTML = `
            <input type="text" class="item-description" placeholder="Item Description">
            <input type="number" class="item-quantity" placeholder="Quantity" value="1">
            <input type="number" class="item-rate" placeholder="Rate" value="0">
            <button type="button" class="remove-item-btn">-</button>
        `;
        itemRowsContainer.appendChild(itemRow);

        itemRow.querySelector(".remove-item-btn").addEventListener("click", () => {
            itemRow.remove();
            updateInvoicePreview();
        });

        itemRow.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", updateInvoicePreview);
        });

        updateInvoicePreview();
    };

    // Event Listeners
    companyNameInput.addEventListener("input", updateInvoicePreview);
    clientNameInput.addEventListener("input", updateInvoicePreview);
    invoiceNumberInput.addEventListener("input", updateInvoicePreview);
    invoiceDateInput.addEventListener("input", updateInvoicePreview);
    templateSelect.addEventListener("change", updateInvoicePreview);
    addItemBtn.addEventListener("click", addItemRow);

    logoUploadInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                logoDataUrl = e.target.result;
                logoPreview.src = logoDataUrl;
                logoPreview.style.display = "block";
                updateInvoicePreview();
            };
            reader.readAsDataURL(file);
        } else {
            logoDataUrl = null;
            logoPreview.src = "";
            logoPreview.style.display = "none";
            updateInvoicePreview();
        }
    });

    generatePdfBtn.addEventListener("click", () => {
        const element = invoicePreview;
        html2canvas(element).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jspdf.jsPDF();
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save("invoice.pdf");
        });
    });

    // Initial preview update and one item row
    addItemRow();
});
