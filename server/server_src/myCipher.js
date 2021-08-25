require("dotenv").config();

exports.myEncrypt = function (plainText) {
  try {
    const crypt = require("crypto");
    const key = crypt.scryptSync(process.env.ENCRYPTION_KEY, "salt", 32);
    const cipher = crypt.createCipheriv(
      "aes-256-cbc",
      key,
      Buffer.alloc(16, 0)
    );
    let cipheredText = cipher.update(plainText, "utf8", "hex");
    cipheredText += cipher.final("hex");
    return cipheredText;
  } catch (e) {
    console.log("暗号化失敗：" + e);
    return "";
  }
};
exports.myDecrypt = function (cipheredText) {
  try {
    const crypt = require("crypto");
    const key = crypt.scryptSync(process.env.ENCRYPTION_KEY, "salt", 32);
    const decipher = crypt.createDecipheriv(
      "aes-256-cbc",
      key,
      Buffer.alloc(16, 0)
    );
    let plainText = decipher.update(cipheredText, "hex", "utf8");
    plainText += decipher.final("utf8");
    return plainText;
  } catch (e) {
    console.log("復号失敗：" + e);
    return "";
  }
};
