const SHEET_NAME = 'Orders';
const SHARED_SECRET = PropertiesService.getScriptProperties().getProperty('LAYALI_WEBHOOK_SECRET');

const HEADERS = [
  'created_at',
  'public_order_id',
  'status',
  'customer_name',
  'phone_e164',
  'currency',
  'subtotal',
  'upsell_total',
  'total',
  'items_json',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'source_url',
  'landing_page',
  'fbp',
  'fbc',
  'ttclid',
  'ttp',
  'sc_click_id',
  'sc_cookie1',
  'event_ids_json',
  'notes'
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
  switch (header) {
    case 'items_json':
      return JSON.stringify(body.items || []);
    case 'event_ids_json':
      return JSON.stringify(body.event_ids || {});
    case 'fbp':
    case 'fbc':
    case 'ttclid':
    case 'ttp':
    case 'sc_click_id':
    case 'sc_cookie1':
      return (body.tracking && body.tracking[header]) || '';
    case 'utm_source':
    case 'utm_medium':
    case 'utm_campaign':
    case 'utm_content':
    case 'utm_term': {
      const key = header.replace('utm_', '');
      return (body.utm && body.utm[key]) || body[header] || '';
    }
    default:
      return body[header] == null ? '' : body[header];
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
