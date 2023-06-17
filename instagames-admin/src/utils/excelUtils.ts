import Excel from 'exceljs';

const readExcelFromAFile = async (filename: any) => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filename);

  return workbook;
};

console.log(readExcelFromAFile('customers.xlsx'));
