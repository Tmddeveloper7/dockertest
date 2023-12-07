const utils = require('./utils.js')
const axios = require('axios')
const authorization =async ($config) =>{
    let $appSecrectKey = utils.getRandomString()
    let $body = {
        "clientid":$config.clientId,
        "clientsecretencrypted":utils.encryptWithMyKey2($config.clientSecrectKey,$config.publicKey),
        "appsecretkey":utils.encryptWithMyKey2($appSecrectKey,$config.publicKey)
    }
    let $response = await axios.post(`${process.env.BASE_URL}/bdoauth/bdoauthenticate`,$body)
    console.log($response.data)
    console.log('Random',$appSecrectKey)
    $response.data.bdo_sekdecrypted = utils.decryptWithKey($appSecrectKey,$response.data.bdo_sek)
    //console.log('DecrypteKey',$response.data.bdo_sekdecrypted)
    return {"randomString":$appSecrectKey,"response":$response.data}
}

module.exports = {authorization}