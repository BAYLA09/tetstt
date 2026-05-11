/**
 * Google Apps Script — يربط الطلبات بجدول Google Sheets
 *
 * 1. افتحي الجدول: https://docs.google.com/spreadsheets/d/1rjz3p7mUnL14uyAEqM4vRPdpVzJuFPX-gxCxSghwOvk/edit
 * 2. Extensions → Apps Script → الصق هذا الملف كاملاً → احفظي
 * 3. من القائمة: Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone (أو Anyone with Google account حسب الحاجة)
 * 4. انسخي رابط الـ Web App (ينتهي بـ /exec) وضعيه في المتجر:
 *    NEXT_PUBLIC_GOOGLE_ORDERS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
 *
 * الصف الأول في الورقة يجب أن يكون عناوين (مثلاً):
 * date | orderId | name | phone | country | product | total | currency | itemsJson
 */

var SPREADSHEET_ID = "1rjz3p7mUnL14uyAEqM4vRPdpVzJuFPX-gxCxSghwOvk";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "empty body" }, 400);
    }
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheets()[0];

    var row = [
      data.date || new Date().toISOString(),
      data.orderId || "",
      data.name || "",
      data.phone || "",
      data.country || "AE",
      data.product || "",
      data.total != null ? data.total : "",
      data.currency || "AED",
      data.itemsJson || "",
    ];
    sheet.appendRow(row);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function jsonResponse(obj, status) {
  var out = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
  // Apps Script لا يدعم status code بسهولة؛ المهم أن JSON يصل للمتصفح
  return out;
}
