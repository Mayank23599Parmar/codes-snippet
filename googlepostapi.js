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
