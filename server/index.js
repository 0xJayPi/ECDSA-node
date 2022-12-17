const secp = require("ethereum-cryptography/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "043b8186db5c3988d5bee8e1027923d75ad1829d457816306a06f3f9bfe4d2b8241400f34d6fa59786994571fdcc2b4ddb5a8c5be5db4b68a1f36cf73acebdc2a8": 100,
  "048b005b1fc492e4921533f04259c5ed28c3beedf43a558b9a7f5b446c1dfdd5fdc9a389fc76b1053e9d6eec260f41d077970ccf8004739ed52982d6bc7f8dd294": 50,
  "040e21bce49731289e1fa923ecb21a869d05da447efc04e0dd8ae47c13574e9b08da721fe32b23a03ccf95414d36ca557825f10c1e5ca260dfac5515ae8bace2fd": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, bit, recipient, amount } = req.body;

  const messageSent = keccak256(utf8ToBytes("Sarlanga!"));
  const sender = toHex(
    secp.recoverPublicKey(messageSent, hexToBytes(signature), bit)
  );

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
