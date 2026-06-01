/**
 * SAFRA SKIN - Orders webhook
 * Sheet: https://docs.google.com/spreadsheets/d/12UOny_tW2vOVclTSe-jLoMeI_KqYZPGZ3TyfjyxBWWw/edit
 *
 * 1. Open THAT sheet > Extensions > Apps Script
 * 2. Delete ALL old code > paste this file > Save
 * 3. Run testAppendRow > authorize
 * 4. Deploy > New deployment > Web app > Me > Anyone > copy /exec URL
 * 5. Easypanel GOOGLE_SHEETS_WEBHOOK_URL = that URL (frontend + backend)
 */

var SPREADSHEET_ID = '12UOny_tW2vOVclTSe-jLoMeI_KqYZPGZ3TyfjyxBWWw';
var SHEET_NAME = 'Orders';

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateOrdersSheet_() {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'date', 'orderid', 'country', 'name', 'phone', 'product',
      'sku', 'quantity', 'total_price', 'currency', 'status'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
  }
  return sheet;
}

function processOrder_(data) {
  var sheet = getOrCreateOrdersSheet_();

  var totalPrice = '';
  if (data.total_price !== undefined && data.total_price !== null) {
    totalPrice = data.total_price;
  }

  sheet.appendRow([
    data.date || '',
    data.orderid || '',
    data.country || 'KSA',
    data.name || '',
    data.phone || '',
    data.product || '',
    data.sku || '',
    data.quantity || '',
    totalPrice,
    data.currency || 'SAR',
    data.status || ''
  ]);

  var row = sheet.getLastRow();
  sheet.getRange(row, 1, 1, 11).setBackground('#d4edda');

  var ss = getSpreadsheet_();
  return {
    orderid: data.orderid || '',
    row: row,
    sheet: SHEET_NAME,
    spreadsheet_name: ss.getName(),
    spreadsheet_id: ss.getId()
  };
}

function readPayload_(e) {
  e = e || {};
  if (e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload);
  }
  if (e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  throw new Error('Missing payload');
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function testAppendRow() {
  var result = processOrder_({
    date: '01/06/2026',
    orderid: 'nama-test-manual',
    country: 'KSA',
    name: 'اختبار يدوي',
    phone: '966501234567',
    product: 'هدوء الدورة',
    sku: 'SK847291CY',
    quantity: '1',
    total_price: 199,
    currency: 'SAR',
    status: ''
  });
  Logger.log(JSON.stringify(result));
}

function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.payload) {
      var data = readPayload_(e);
      var result = processOrder_(data);
      return jsonOut_({ success: true, orderid: result.orderid, row: result.row, spreadsheet_name: result.spreadsheet_name });
    }
    var sheet = getOrCreateOrdersSheet_();
    var ss = getSpreadsheet_();
    return jsonOut_({
      status: 'ok',
      sheet: SHEET_NAME,
      spreadsheet_name: ss.getName(),
      spreadsheet_id: ss.getId(),
      last_row: sheet.getLastRow()
    });
  } catch (err) {
    return jsonOut_({ success: false, error: String(err.message || err) });
  }
}

function doPost(e) {
  try {
    var data = readPayload_(e);
    var result = processOrder_(data);
    return jsonOut_({ success: true, orderid: result.orderid, row: result.row, spreadsheet_name: result.spreadsheet_name });
  } catch (err) {
    return jsonOut_({ success: false, error: String(err.message || err) });
  }
}
