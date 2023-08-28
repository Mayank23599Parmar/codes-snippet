var sheetName = 'Sheet1'
		var scriptProp = PropertiesService.getScriptProperties()

		function intialSetup () {
		  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
		  scriptProp.setProperty('key', activeSpreadsheet.getId())
		}

		function doPost (e) {
		  var lock = LockService.getScriptLock()
		  lock.tryLock(10000)

		  try {
			var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
			var sheet = doc.getSheetByName(sheetName)

			var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
			var nextRow = sheet.getLastRow() + 1

			var newRow = headers.map(function(header) {
			  return header === 'timestamp' ? new Date() : e.parameter[header]
			})

			sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

			return ContentService
			  .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
			  .setMimeType(ContentService.MimeType.JSON)
		  }

		  catch (e) {
			return ContentService
			  .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
			  .setMimeType(ContentService.MimeType.JSON)
		  }

		  finally {
			lock.releaseLock()
		  }
		}
            
         ===========================================
            if(submitBtn){
            submitBtn.addEventListener("click",async()=>{
                console.log(commet_input.value)
                    let formDatahere = new FormData();
                    formDatahere.append("first_name",submitBtn.dataset.first_name);
                    formDatahere.append("last_name",submitBtn.dataset.last_name);
                    formDatahere.append("phone",submitBtn.dataset.mobile);
                    formDatahere.append("email",submitBtn.dataset.email);
                    formDatahere.append("star",this.feedbackStarCount);
                    formDatahere.append("comment",commet_input.value);
                    formDatahere.append("timestamp",new Date());
                    //testw
                let response = await fetch("https://script.google.com/macros/s/AKfycbxmW-eiHzqSL_kmmsICMXgMSQs4k53XYa8efXDYPqxwVJZAdywT2Bmvy2ltcTusHqq_/exec", {
                    method: 'POST',
                    body: formDatahere,
                    mode: 'no-cors',
                    headers: {
                        "Content-Type": "application/json",
                     },
                  });
                  response = await response.json();
                  if(response.status == 200){
                      console.log("success message")
                  }
            })
        }
=======================================
// original from: http://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/// original gist: https://gist.github.com/willpatera/ee41ae374d3c9839c2d6 function doGet(e){
  return handleResponse(e);
}
//  Enter sheet name where data is to be written below        var SHEET_NAME = "Sheet1";
var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property servicefunction handleResponse(e) {
  // shortly after my original solution Google announced the LockService[1]  // this prevents concurrent access overwritting data  // [1] http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html  // we want a public lock, one that locks for all invocations  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.  try {
    // next set where we write the data - you could write to multiple/alternate destinations    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    // we'll assume header is in row 1 but you can override with header_row in GET/POST data    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row    var row = []; 
    // loop through the header columns    for (i in headers){
      if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column        row.push(new Date());
      } else { // else use header name to get data        row.push(e.parameter[headers[i]]);
      }
    }
    // more efficient to set values as [][] array than individually    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    // return json success results    return ContentService          .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    // if error return this    return ContentService          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { //release lock    lock.releaseLock();
  }
}
function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}
