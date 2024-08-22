import CryptoJs from 'crypto-js'

const encrypt = (text: string) => {
    const encryptedText = CryptoJs.AES.encrypt(text, process.env.AES_KEY!).toString()
    return encryptedText
};

const decrypt = (text: string): string => {
    const decryption = CryptoJs.AES.decrypt(text, process.env.AES_KEY!)
    const decryptedText = decryption.toString(CryptoJs.enc.Utf8)
    return decryptedText
};

export { encrypt, decrypt } 