const { Keyring } = require("@polkadot/keyring");

const seeds =
  "sick rather adult awkward siren upon captain gun timber evolve umbrella swift";

// 2. Construct auth header
const keyring = new Keyring();
const pair = keyring.addFromUri(seeds);
const sig = pair.sign(pair.address);
const sigHex = "0x" + Buffer.from(sig).toString("hex");

const authHeader = Buffer.from(`sub-${pair.address}:${sigHex}`).toString(
  "base64"
);
console.log(pair.address);
console.log(sigHex);
console.log(authHeader);
