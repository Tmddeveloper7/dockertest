const key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const crypto = require("crypto");
const $alogrithm = 'aes-256-cbc';

const iv = crypto.randomBytes(16);


const getRandomString = () =>{
    let $randomKey=""
    const keyLength  = 32
    for(let $i=0;$i<keyLength;$i++) {
        const index = Math.floor(Math.random() * $i);
        $randomKey+=key.charAt(index)
    }
    return $randomKey;
}

const encryptWithAes = (data,key) =>{

    const keyBytes = getKeyBytes(key);

    const AESsecretKey = Buffer.from(keyBytes);

    const cipher = crypto.createCipheriv('aes-256-ecb', AESsecretKey, null);

    let encryptedText = cipher.update(data, 'utf-8', 'base64') + cipher.final('base64');
    return encryptedText;
}


const encryptWithMyKey2=(data, key) => {
    try {
        const publicKey =  key
        const bufferData = Buffer.from(data, 'utf-8');

        const encryptedData = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            bufferData
        );

        return encryptedData.toString('base64');
    } catch (error) {
        console.error(error);
        throw error;
    }
}


const decryptWithKey = (data,key) =>{ 
    const cipheredBytes = Buffer.from(key, 'base64');
    const keyBytes = getKeyBytes(data);
    const decipher = crypto.createDecipheriv('aes-256-ecb', keyBytes, null);
    let convertedValue = decipher.update(cipheredBytes, 'binary', 'utf-8');
    console.log(convertedValue)
    convertedValue += decipher.final('utf-8');
    return convertedValue;
}
const getKeyBytes=(appSecretKey) =>{
    const keyBytes = Buffer.alloc(32);
    const parameterKeyBytes = Buffer.from(appSecretKey, 'utf-8');
    parameterKeyBytes.copy(keyBytes, 0, 0, Math.min(parameterKeyBytes.length, keyBytes.length));
    return keyBytes;
}
module.exports = {getRandomString,encryptWithMyKey2,encryptWithAes,decryptWithKey}





