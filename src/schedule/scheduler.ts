require('dotenv').config()
const  {sendInvoice} = require('./irn-outbox.ts')

async function runScheduler() {
  clearTimeout(intervalObj)
  console.log('Looking for pending documents..')
	await sendInvoice()
    .then(()=>{
     intervalObj = setInterval(() => {
        runScheduler()
      }, 10000)
    });

}
let intervalObj = setInterval(() => {
  runScheduler()
  }, 10000);

