const SHEET_NAME = 'Orders';
const SHARED_SECRET = PropertiesService.getScriptProperties().getProperty('LAYALI_WEBHOOK_SECRET');

/** Column keys for appendRow. Add e.g. 'url' after 'product' for new spreadsheets if you need page URL. */
const HEADERS = [
  'date',
  'orderid',
  'country',
  'name',
  'phone',
  'product',
  'sku',
  'quantity',
  'totalprice',
  'currency',
  'status'
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');

    if (SHARED_SECRET) {
      const receivedSecret = body.secret || '';
      if (receivedSecret !== SHARED_SECRET) {
        return jsonResponse({ ok: false, error: 'Unauthorized' });
      }
    }

    const sheet = getOrCreateSheet_();
    ensureHeaders_(sheet);

    const row = HEADERS.map((header) => valueForHeader_(body, header));
    sheet.appendRow(row);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  const range = sheet.getRange(1, 1, 1, HEADERS.length);
  const current = range.getValues()[0];
  const hasHeaders = current.some((value) => value);

  if (!hasHeaders) {
    range.setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function valueForHeader_(body, header) {
  return body[header] == null ? '' : body[header];
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
