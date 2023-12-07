require('dotenv').config()
const utils = require('./utils.js')
//const rsa = require('./RSA.js')
const axios=require('axios')
const { authorization } = require('./Authorization')

const start =async ($config,$invoice,$type) =>{
    let $authorization = await authorization($config)
    return await process($config,$type,$authorization,JSON.stringify($invoice))
}
const getIrn =async ($config,$irn) =>{
    let $authorization = await authorization($config)
    let $headers =getHeaders($config,$authorization,'get');
    delete $headers.action
    let $response = await axios.get(getUrl('get')+`/${$irn}`,{"headers":$headers})
    console.log($response)
   
}
const getIrnStatus =async ($config,$invoice) =>{
    let $authorization = await authorization($config)
    let $headers =getHeaders($config,$authorization,'status');
    let $body = getRequestBody(JSON.stringify($invoice),$authorization.response.bdo_sekdecrypted,'status')
    delete $headers.action
    let $response = await axios.post(getUrl('status'),$body,{"headers":$headers})
    console.log($response)
   
}


const getHeaders = ($config,$authorization,$type) =>{
    return {
        client_id:$config.clientId,
        bdo_authtoken:$authorization.response.bdo_authtoken,
        action:$type=='new' ? "GENIRN" : $type=='cancel' ? 'CANIRN' : ''
    }
}
const getRequestBody = ($data,$encryptionKey,$type) =>{
    return {  
        "Data":utils.encryptWithAes($data,$encryptionKey),
    }
}
const parseResponse = ($data,$type,$decryptionKey) =>{
    if($type=='cancel') {
        return $data
    }
    let $irnDecoded = utils.decryptWithKey($decryptionKey,$data)

    if($type=='status') {
        return $irnDecoded
    }
    $irnDecoded = JSON.parse($irnDecoded)
    $irnDecoded.invoice = JSON.parse($irnDecoded.Invoice)
    $irnDecoded.QRCode = JSON.parse($irnDecoded.QRCode)
    return {
        "irn":$irnDecoded.Irn,
        "ack_no":$irnDecoded.AckNo,
        "ack_date":$irnDecoded.AckDt,
        "signed_qr_code":$irnDecoded.SignedQRCode,
        "signed_invoice":$irnDecoded.SignedInvoice
    }
}
const getUrl = ($type) =>{
    let $url =`https://sandboxeinvoiceapi.bdo.in/bdoapi/public/${$type=='new' ? 'generateIRN' : $type=='cancel' ? 'cancelIRN' : $type=='status' ? 'bdoportalgetirnstatus' : 'getIRNDetails'}`
    return $url;
}
const process = async($config,$type,$authorization,$invoice) =>{
    try {
        let $headers =getHeaders($config,$authorization,$type);
        console.log($headers)
        let $body = getRequestBody($invoice,$authorization.response.bdo_sekdecrypted,$type)
        let $response = await axios.post(getUrl($type),$body,{"headers":$headers})
        let $irnResponse = $response.data
        console.log('Response Data',$irnResponse)
        if($irnResponse.status=='0' && $irnResponse.Error) {
            return Promise.reject($irnResponse.Error)
        } else {
            return Promise.resolve(parseResponse($irnResponse.Data,$type,$authorization.response.bdo_sekdecrypted))

        }
    } catch(exception) {
        console.log('exception',exception)
    }
}
module.exports = {start,getIrn,getIrnStatus}