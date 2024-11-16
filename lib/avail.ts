import { Keyring } from "@polkadot/api";
import { SDK } from "avail-js-sdk";
import { WaitFor } from "avail-js-sdk/sdk/transactions";

export const submitAndRecieveData = async () => {
  const providerEndpoint = "wss://turing-rpc.avail.so/ws";
  const sdk = await SDK.New(providerEndpoint);

  const private_key =
    "pink fish prosper simple dutch enforce young december spot guitar summer whisper";
  if (!private_key) {
    throw new Error("Environment variable private_key is required.");
  }
  const account = new Keyring({ type: "sr25519" }).addFromUri(private_key);
  const data = "This is a randomg ygf data to be submitted to the chain";
  const appId = 201;
  const options = { app_id: appId };

  const result = await sdk.tx.dataAvailability.submitData(
    data,
    WaitFor.BlockInclusion,
    account,
    options
  );
  if (result.isErr) {
    console.log(result.reason);
    // process.exit(1);
  }else{

  console.log("Data=" + result.txData.data);
  console.log(
    "Who=" + result.event.who + ", DataHash=" + result.event.dataHash
  );
  console.log("TxHash=" + result.txHash + ", BlockHash=" + result.blockHash);

  //Get
  const block = await sdk.api.rpc.chain.getBlock(result.blockHash);

  const tx = block.block.extrinsics.find(
    (tx) => tx.hash.toHex() == result.txHash.toHex()
  );

  if (tx === undefined) {
    console.log("Failed to find the Submit Data transaction");
    process.exit(1);
  }

  console.log(JSON.stringify(tx));
  const dataHex = tx.method.args.map((a) => a.toString()).join("; ");
  let str = "";
  for (let n = 0; n < dataHex.length; n += 2) {
    str += String.fromCharCode(parseInt(dataHex.substring(n, n + 2), 16));
  }

  console.log(`submitted data: ${str}`);
  }
  // process.exit();
};

submitAndRecieveData();
