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
                        <tr>
                            <td>Item 1</td>
                            <td>1</td>
                            <td>100</td>
                            <td>100</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="total">
                <p><strong>Total:</strong> $100</p>
            </div>
        `;
    };

    // Event Listeners
    companyNameInput.addEventListener("input", updateInvoicePreview);
    clientNameInput.addEventListener("input", updateInvoicePreview);
    invoiceNumberInput.addEventListener("input", updateInvoicePreview);
    invoiceDateInput.addEventListener("input", updateInvoicePreview);
    templateSelect.addEventListener("change", updateInvoicePreview);

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

    // Initial preview update
    updateInvoicePreview();
});

