const irn = require('./core/irn.js')
//const cancelEInvoice =require('./cancelInvoice.js')

const getPEM =($key) =>{
    return `-----BEGIN PUBLIC KEY-----\n${$key}\n-----END PUBLIC KEY-----`
}

const getCredentials =($config) =>{
    return {
        clientId:$config.clientId || process.env.CLIENT_ID,
        clientSecrectKey:$config.clientSecrectKey || process.env.CLIENT_SECRET_KEY,
        publicKey: getPEM($config.publicKey || process.env.ENCRYPTION_KEY)
    }
}

const generateInvoice =async ($config,$invoice) =>{
    let $credentials = getCredentials($config);
    return await irn.start($credentials,$invoice,'new')
}


const cancelInvoice = async($config,$invoice) =>{
    let $credentials = getCredentials($config);
    return await irn.start($credentials,$invoice,'cancel')  
}

const getIrn = async($config,$irn) =>{
    let $credentials = getCredentials($config);
    return await irn.getIrn($credentials,$irn)  
}


const getIrnStatus = async($config,$invoice) =>{
    let $credentials = getCredentials($config);
    return await irn.start($credentials,$invoice,'status')  
}

const generateCreditDebitNote =async ($config,$invoice) =>{
    let $credentials = getCredentials($config);
    return await irn.start($credentials,$invoice,'new')
}

module.exports = { 
    generateInvoice,generateCreditDebitNote,cancelInvoice,getIrn,getIrnStatus
}

