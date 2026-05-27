const SHEET_NAME = 'Orders';
const SHARED_SECRET = PropertiesService.getScriptProperties().getProperty('LAYALI_WEBHOOK_SECRET');

/**
 * Layali orders sheet — required when the web app is deployed as a standalone script
 * (not "bound" to the spreadsheet). Override via Script property SPREADSHEET_ID.
 */
const DEFAULT_SPREADSHEET_ID = '1rjz3p7mUnL14uyAEqM4vRPdpVzJuFPX-gxCxSghwOvk';

/**
 * Must match backend order_to_sheet_payload and your sheet header row (column order).
 * date, orderid, country, name, phone, product, url, sku, quantity, totalprice, currency, status
 */
const HEADERS = [
  'date',
  'orderid',
  'country',
  'name',
  'phone',
  'product',
  'url',
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

function getSpreadsheetId_() {
  const props = PropertiesService.getScriptProperties();
  const id = (props.getProperty('SPREADSHEET_ID') || DEFAULT_SPREADSHEET_ID || '').trim();
  if (!id) {
    throw new Error('SPREADSHEET_ID not set in script properties');
  }
  return id;
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(getSpreadsheetId_());
}

function getOrCreateSheet_() {
  const spreadsheet = getSpreadsheet_();
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
