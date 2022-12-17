import { useState } from "react";
import server from "./server";

import * as secp from "ethereum-cryptography/secp256k1";
import { toHex} from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  // const [signature, setSignature] = useState("");
  // const [bit, setBit] = useState(0);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const messageSent = keccak256(utf8ToBytes("Sarlanga!"));
    const [signature, bit] = await secp.sign(messageSent, privateKey, { recovered: true });

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: toHex(signature),
        bit: bit,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  console.log("(Transfer) Post sent!" )
  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
