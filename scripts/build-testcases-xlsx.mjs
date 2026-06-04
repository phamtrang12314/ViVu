import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "D:/Ktruc/ViVuGo/outputs";
const outputPath = `${outputDir}/ViVuGo_TestCases.xlsx`;

const workbook = Workbook.create();

const sheets = [
  {
    name: "Summary",
    title: "ViVuGo - Bo Testcase Du An",
    columns: ["Nhom", "So testcase", "Pham vi"],
    rows: [
      ["Backend Unit Test", 15, "Payment code, booking, payment webhook, refund, auth"],
      ["Client Manual Test", 12, "Trang chu, tour, auth, booking, payment, account"],
      ["Admin Manual Test", 10, "Dashboard, tour, destination, booking, refund, review, contact"],
      ["Backend API Test", 10, "Auth, booking, webhook, tour, review, contact, admin booking"],
    ],
    widths: [26, 14, 72],
  },
  {
    name: "Backend Unit",
    title: "Backend - Unit Test Tu Dong",
    columns: ["Ma TC", "Khu vuc", "Muc tieu", "Du lieu / Dieu kien", "Ket qua mong doi", "Trang thai"],
    rows: [
      ["BE-UT-01", "PaymentCodeUtils", "Chuan hoa ma booking dang TBBK co gach noi", "TBBK-45915D45-C4EC-4F98-ABCD-123456789ABC", "Tra ve tbbk-45915d45-c4ec-4f98-abcd-123456789abc", "Automated"],
      ["BE-UT-02", "PaymentCodeUtils", "Trich ma booking compact sau tien to ngan hang", "131273790555-tbbk45915d45c4ec4f98abcd123456789abc", "Tra ve ma booking co gach noi dung format", "Automated"],
      ["BE-UT-03", "PaymentCodeUtils", "Tim ma booking dau tien trong nhieu nguon text", "null, text sai, text co ma hop le", "Bo qua gia tri sai va lay ma hop le dau tien", "Automated"],
      ["BE-UT-04", "BookingService", "Lay payment status moi nhat", "Invoice co payment SUCCESS cu va PENDING moi", "Tra ve PENDING theo paymentDate moi nhat", "Automated"],
      ["BE-UT-05", "BookingService", "Tinh timeout cho booking het han", "BookingDate qua 31 phut, chua thanh toan", "Tra ve 0 giay", "Automated"],
      ["BE-UT-06", "BookingService", "Tinh hoan tien trong 1 gio sau thanh toan", "Payment SUCCESS cach 30 phut", "Tra ve 100%", "Automated"],
      ["BE-UT-07", "BookingService", "Tinh hoan tien sat gio khoi hanh", "Tour khoi hanh trong ngay", "Tra ve 0%", "Automated"],
      ["BE-UT-08", "BookingService", "Xu ly webhook thanh toan du tien", "Booking PROCESSING, amount bang finalAmount", "Booking CONFIRMED, payment SUCCESS, gui email", "Automated"],
      ["BE-UT-09", "BookingService", "Tu choi webhook thanh toan thieu tien", "Amount nho hon finalAmount", "Nem IllegalArgumentException, khong luu payment", "Automated"],
      ["BE-UT-10", "BookingService", "Bo qua webhook trung ma giao dich", "TransactionCode da ton tai", "Khong cap nhat booking, khong luu payment", "Automated"],
      ["BE-UT-11", "BookingService", "Huy booking chua thanh toan", "Booking PROCESSING, payment PENDING", "Booking chuyen sang CANCELED", "Automated"],
      ["BE-UT-12", "BookingService", "Tao yeu cau hoan tien cho booking da thanh toan", "Booking CONFIRMED, payment SUCCESS, ly do hop le", "Booking CANCELLATION_REQUESTED, refund PENDING", "Automated"],
      ["BE-UT-13", "AuthService", "Dang nhap bang email khi username lookup khong thay", "Email dung, password dung", "Tra ve success=true va Bearer token", "Automated"],
      ["BE-UT-14", "AuthService", "Tu choi tai khoan bi khoa", "Account locked=true", "Tra ve success=false", "Automated"],
      ["BE-UT-15", "AuthService", "Doi mat khau hop le", "Old password dung, new password >= 8 ky tu", "Ma hoa mat khau moi va save account", "Automated"],
    ],
    widths: [14, 22, 44, 46, 54, 16],
  },
  {
    name: "Client Manual",
    title: "Client - Testcase Thu Cong",
    columns: ["Ma TC", "Chuc nang", "Tien dieu kien", "Buoc test", "Ket qua mong doi", "Loai"],
    rows: [
      ["CL-01", "Trang chu", "Backend chay, co du lieu tour", "Mo client, xem hero, danh muc, tour noi bat", "Trang load khong loi, du lieu hien thi dung", "Manual"],
      ["CL-02", "Tim/lok tour", "Co nhieu tour", "Nhap tu khoa, chon bo loc loai tour/dia diem", "Danh sach tour cap nhat theo tieu chi", "Manual"],
      ["CL-03", "Chi tiet tour", "Co tour active", "Mo mot tour bat ky", "Hien thi anh, lich trinh, gia, review, nut dat tour", "Manual"],
      ["CL-04", "Dang ky", "Email/SDT chua ton tai, co OTP hop le", "Nhap thong tin hop le va OTP", "Tai khoan duoc tao, dang nhap thanh cong", "Manual"],
      ["CL-05", "Dang nhap dung", "Co tai khoan customer", "Nhap email/SDT va mat khau dung", "Luu token, chuyen ve trang tai khoan/trang chu", "Manual"],
      ["CL-06", "Dang nhap sai", "Co tai khoan customer", "Nhap mat khau sai", "Hien thi thong bao loi, khong luu token", "Manual"],
      ["CL-07", "Dat tour", "Da dang nhap", "Chon tour, nhap so khach va thong tin nguoi tham gia", "Booking duoc tao, chuyen sang buoc thanh toan", "Manual"],
      ["CL-08", "Thanh toan", "Booking dang PROCESSING", "Mo man thanh toan", "Hien thi ma booking, so tien, QR/thong tin chuyen khoan", "Manual"],
      ["CL-09", "Lich su tour", "Da co booking", "Vao tai khoan > lich su tour", "Danh sach booking dung trang thai va so tien", "Manual"],
      ["CL-10", "Huy tour", "Booking hop le de huy", "Nhap ly do toi thieu 5 ky tu va gui", "Booking huy hoac tao yeu cau hoan tien theo trang thai", "Manual"],
      ["CL-11", "Yeu thich", "Da dang nhap", "Them/xoa tour yeu thich", "Danh sach yeu thich cap nhat dung", "Manual"],
      ["CL-12", "Lien he", "Khong can dang nhap", "Gui form lien he hop le", "Thong bao gui thanh cong, admin nhan duoc message", "Manual"],
    ],
    widths: [14, 22, 42, 54, 58, 14],
  },
  {
    name: "Admin Manual",
    title: "Admin - Testcase Thu Cong",
    columns: ["Ma TC", "Chuc nang", "Tien dieu kien", "Buoc test", "Ket qua mong doi", "Loai"],
    rows: [
      ["AD-01", "Admin login", "Co tai khoan admin", "Nhap SDT va mat khau dung", "Vao dashboard admin", "Manual"],
      ["AD-02", "Dashboard", "Admin da dang nhap", "Mo dashboard", "Thong ke doanh thu, booking, tour hien thi dung", "Manual"],
      ["AD-03", "Quan ly tour", "Co du lieu destination/type", "Tao tour moi hop le", "Tour duoc luu va xuat hien trong danh sach", "Manual"],
      ["AD-04", "Cap nhat tour", "Co tour ton tai", "Sua gia, lich trinh, trang thai", "Du lieu tour cap nhat dung", "Manual"],
      ["AD-05", "Quan ly loai tour", "Admin da dang nhap", "Tao/sua/xoa loai tour", "Danh sach loai tour cap nhat dung", "Manual"],
      ["AD-06", "Quan ly destination", "Admin da dang nhap", "Tao destination kem anh", "Destination luu dung anh va mo ta", "Manual"],
      ["AD-07", "Quan ly booking", "Co booking", "Loc theo trang thai, mo chi tiet", "Thong tin khach, tour, payment dung", "Manual"],
      ["AD-08", "Duyet huy/hoan tien", "Co booking CANCELLATION_REQUESTED", "Xu ly yeu cau hoan tien", "Trang thai refund/booking cap nhat dung", "Manual"],
      ["AD-09", "Quan ly review", "Co review pending/approved", "Duyet hoac an review", "Review hien thi/an dung o client", "Manual"],
      ["AD-10", "Tin nhan lien he", "Co message tu client", "Mo chi tiet, phan hoi", "Message chuyen trang thai da xu ly", "Manual"],
    ],
    widths: [14, 24, 42, 50, 56, 14],
  },
  {
    name: "Backend API",
    title: "Backend/API - Testcase Tich Hop Goi Y",
    columns: ["Ma TC", "API", "Du lieu test", "Ket qua mong doi", "Loai"],
    rows: [
      ["API-01", "POST /api/auth/login", "Email/SDT dung, password dung", "HTTP 200, success=true, co token", "Integration"],
      ["API-02", "POST /api/auth/login", "Password sai", "HTTP 200/401 theo controller, success=false", "Integration"],
      ["API-03", "POST /api/bookings", "Token customer, tourID hop le, so khach hop le", "Tao booking PROCESSING, tong tien dung", "Integration"],
      ["API-04", "POST /api/sepay/webhook", "Noi dung co ma booking compact, so tien du", "Booking CONFIRMED, payment SUCCESS", "Integration"],
      ["API-05", "POST /api/sepay/webhook", "Noi dung khong co bookingID", "Tra success de webhook khong retry, khong cap nhat booking", "Integration"],
      ["API-06", "GET /api/tours", "Khong filter", "Tra danh sach tour active", "Integration"],
      ["API-07", "GET /api/tours/{id}", "TourID ton tai", "Tra chi tiet tour, anh, lich trinh", "Integration"],
      ["API-08", "POST /api/reviews", "Customer da di tour", "Tao review dung rating/content", "Integration"],
      ["API-09", "POST /api/contact", "Form lien he hop le", "Luu message moi", "Integration"],
      ["API-10", "GET /api/admin/bookings", "Token admin", "Tra danh sach booking phan trang", "Integration"],
    ],
    widths: [14, 30, 54, 58, 16],
  },
];

const colors = {
  title: "#0F766E",
  titleText: "#FFFFFF",
  header: "#134E4A",
  headerText: "#FFFFFF",
  stripe: "#F0FDFA",
  border: "#CBD5E1",
  note: "#FEF3C7",
};

for (const spec of sheets) {
  const sheet = workbook.worksheets.add(spec.name);
  sheet.showGridLines = false;

  const columnCount = spec.columns.length;
  const lastCol = columnName(columnCount);
  const titleRange = sheet.getRange(`A1:${lastCol}1`);
  titleRange.merge();
  titleRange.values = [[spec.title]];
  titleRange.format = {
    fill: colors.title,
    font: { bold: true, color: colors.titleText, size: 15 },
    horizontalAlignment: "center",
    verticalAlignment: "center",
  };
  titleRange.format.rowHeightPx = 34;

  sheet.getRangeByIndexes(1, 0, 1, columnCount).values = [spec.columns];
  sheet.getRangeByIndexes(1, 0, 1, columnCount).format = {
    fill: colors.header,
    font: { bold: true, color: colors.headerText },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: colors.border },
  };
  sheet.getRangeByIndexes(1, 0, 1, columnCount).format.rowHeightPx = 30;

  sheet.getRangeByIndexes(2, 0, spec.rows.length, columnCount).values = spec.rows;
  const body = sheet.getRangeByIndexes(2, 0, spec.rows.length, columnCount);
  body.format = {
    wrapText: true,
    verticalAlignment: "top",
    borders: { preset: "all", style: "thin", color: colors.border },
  };

  for (let i = 0; i < spec.rows.length; i += 2) {
    sheet.getRangeByIndexes(2 + i, 0, 1, columnCount).format.fill = colors.stripe;
  }

  if (spec.name !== "Summary") {
    sheet.tables.add(`A2:${lastCol}${spec.rows.length + 2}`, true, `${spec.name.replaceAll(" ", "")}Table`);
  } else {
    sheet.tables.add(`A2:${lastCol}${spec.rows.length + 2}`, true, "SummaryTable");
    const note = sheet.getRange("A8:C8");
    note.merge();
    note.values = [["Ghi chu: Cac testcase Automated nam trong thu muc vivugo-backend/src/test/java. Cac testcase Manual/API dung de kiem thu tay hoac viet tiep integration test."]];
    note.format = {
      fill: colors.note,
      font: { italic: true, color: "#713F12" },
      wrapText: true,
      borders: { preset: "outside", style: "thin", color: "#F59E0B" },
    };
    note.format.rowHeightPx = 44;
  }

  for (let i = 0; i < spec.widths.length; i++) {
    sheet.getRangeByIndexes(0, i, 1, 1).format.columnWidth = spec.widths[i];
  }
  sheet.freezePanes.freezeRows(2);
}

await fs.mkdir(outputDir, { recursive: true });

const summary = await workbook.inspect({
  kind: "sheet,table",
  include: "name,range,values",
  tableMaxRows: 5,
  tableMaxCols: 6,
  maxChars: 6000,
});
console.log(summary.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

for (const sheet of sheets) {
  await workbook.render({
    sheetName: sheet.name,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
}

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(`Saved ${outputPath}`);

function columnName(index) {
  let name = "";
  while (index > 0) {
    const remainder = (index - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    index = Math.floor((index - 1) / 26);
  }
  return name;
}
