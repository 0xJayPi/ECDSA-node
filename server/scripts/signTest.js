const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const PRIVATE_KEY =
  "24acbff76b96cd9db03a5281ebbde3e3a8da33927751224d811cddd1958a8ca1";
const PUBLIC_KEY =
  "043b8186db5c3988d5bee8e1027923d75ad1829d457816306a06f3f9bfe4d2b8241400f34d6fa59786994571fdcc2b4ddb5a8c5be5db4b68a1f36cf73acebdc2a8";

async function main() {
  const messageSent = keccak256(utf8ToBytes("Sarlanga!"));
  const [signature, bit] = await secp.sign(messageSent, PRIVATE_KEY, {
    recovered: true,
  });
  const publicKey = toHex(secp.recoverPublicKey(messageSent, signature, bit));

  console.log(signature);
  console.log(`Recovery Bit is ${bit}`);
  console.log(publicKey);

  if (publicKey === PUBLIC_KEY) {
    console.log("Matched!!!");
  } else {
    console.log("Failed...");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
