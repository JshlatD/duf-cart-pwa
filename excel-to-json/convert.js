const ExcelJS = require("exceljs");
const fs = require("fs");

async function convert() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("catalog.xlsx");
  const sheet = workbook.worksheets[0];

  const rows = [];
  sheet.eachRow((row, i) => {
    if (i === 1) return;
    rows.push({
      NUMBER: row.getCell(1).value,
      DISCR: row.getCell(2).value,
      DIA: row.getCell(3).value,
      HEIGHT: row.getCell(4).value,
      PRICE: row.getCell(5).value
    });
  });

  fs.writeFileSync("C:/DUF Catlog APP/cartPWA/assets/catalog.json", JSON.stringify(rows, null, 2));
}

convert();
