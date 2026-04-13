function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var tabName = (payload.tab || '').toString().trim();
    var values = payload.values || [];

    var ss = SpreadsheetApp.openById('1D_g_uwwbCKhW9hewX-vAq8DHPW0ZvzB-SRvsRDb866U');
    var sheet = ss.getSheetByName(tabName);

    if (!sheet) {
      // Return all available sheet names to help debug
      var allSheets = ss.getSheets().map(function(s) { return s.getName(); });
      return ContentService.createTextOutput(JSON.stringify({ error: 'Tab not found: ' + tabName, availableTabs: allSheets })).setMimeType(ContentService.MimeType.JSON);
    }

    // Scan column B from row 5 to find the first truly empty cell
    var writeRow = 5;
    var colB = sheet.getRange('B5:B500').getValues();
    for (var i = 0; i < colB.length; i++) {
      if (colB[i][0] === '' || colB[i][0] === null || colB[i][0] === undefined) {
        writeRow = 5 + i;
        break;
      }
    }

    var rowNum = writeRow - 4;

    sheet.getRange(writeRow, 1).setValue(rowNum);
    sheet.getRange(writeRow, 2, 1, values.length).setValues([values]);

    return ContentService.createTextOutput(JSON.stringify({ success: true, row: writeRow })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
