import React, { useState } from "react";
import "./App.css";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundleForPolkadot } from "@crustio/type-definitions";

import { create } from "ipfs-http-client";
import axios from "axios";
// import got from "got";
const ipfsGateway = "https://crustwebsites.net";

const authHeader = Buffer.from(
  // `pol-0x272a8f05d05d69b6d8261538b031ffac60ba0c8c:0xd25e6494e0ad7988815f07670d1a0133150b039a5a796efea50f72cde520731354fbf4fac099e81a346abf76d7d8f0fb7cabbfa3a17d5d2829d1a85aa607884e1c`
  `sub-5EoX3ZVUSKbQHqkuvCWvintEnqeAXWdiMer6yP23EE9oajt5:0xe8a9fe4209d477cadfdba2ce5a4446c49589b39154a643fc9bfc6b55d35cdd15be8cf6d23ea84d441dd1226e2f05158a6f24a6a30cf051cab2d40788a6e89e0f`
).toString("base64");

const ipfsPinningService = "https://pin.crustcode.com/psa"; // IPFS Web3 Authed Pinning Service address

const ipfs = create({
  url: ipfsGateway + "/api/v0",
  headers: {
    authorization: "Basic " + authHeader,
  },
});

function App() {
  const [fileUrl, updateFileUrl] = useState(``);
  async function onChange(e) {
    console.log(e.target.files);
    const file = e.target.files[0];
    try {
      const added = await ipfs.add(file);
      console.log(added);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      updateFileUrl(url);

      console.log(`cid v0 ${added.cid.toV0().toString()}`);
      const result = await axios.post(
        ipfsPinningService + "/pins",
        {
          cid: added.cid.toV0().toString(),
          name: "crust-demo",
        },
        {
          headers: {
            authorization: "Bearer " + authHeader,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(result);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const getStatusMaxwell = async () => {
    try {
      const cid = "QmX99nbyp1geRT9i3RigeV2p1vx9gKpaqRTgVkqGYJ2nTH";
      const chainAddr = "wss://api.decloudf.com/";
      // const chainAddr = "wss://api.crust.network";
      // const chainAddr = "wss://rpc.crust.network";
      const wsProvider = new WsProvider(chainAddr);

      const chain = new ApiPromise({
        provider: wsProvider,
        typesBundle: typesBundleForPolkadot,
      });
      await chain.isReady;

      console.log("Connected to api.decloudf.com");

      console.log("Query file info");
      const fileInfo = await chain.query.market.files(cid);

      console.log("Raw file Info");
      console.log(fileInfo);

      console.log("fileInfo.toHuman()");
      console.log(fileInfo.toHuman());

      console.log("JSON.parse(fileInfo)");
      console.log(JSON.parse(fileInfo));

      chain.disconnect();
    } catch (e) {
      console.error(`Query status failed with ${e}`);
    }
  };

  const getStatusMainnet = async () => {
    try {
      const cid = "QmUquomBemrfkAHepxYTDK2duPZHvEZZXcJSd7XGvj5tex";
      // const chainAddr = "wss://api.decloudf.com/";
      // const chainAddr = "wss://api.crust.network";
      const chainAddr = "wss://rpc.crust.network";
      const wsProvider = new WsProvider(chainAddr);

      const chain = new ApiPromise({
        provider: wsProvider,
        typesBundle: typesBundleForPolkadot,
      });
      await chain.isReadyOrError;

      console.log("Connected to wss://rpc.crust.network");

      console.log("Query file info");
      const fileInfo = await chain.query.market.files(cid);

      console.log("Raw file Info");
      console.log(fileInfo);

      console.log("fileInfo.toHuman()");
      console.log(fileInfo.toHuman());

      console.log("JSON.parse(fileInfo)");
      console.log(JSON.parse(fileInfo));

      chain.disconnect();
    } catch (e) {
      console.error(`Query status failed with ${e}`);
    }
  };
  return (
    <div className="App">
      <div>
        GET STATUS OF MAXWELL ORDER FOLLOWING THE INSTRUCTION ON
        https://github.com/crustio/crust.js
      </div>
      <div>wss://api.decloudf.com/</div>
      <div>
        CID (can view status on Cruscan.com):
        QmX99nbyp1geRT9i3RigeV2p1vx9gKpaqRTgVkqGYJ2nTH
      </div>
      <button type="button" onClick={getStatusMaxwell}>
        Get Status Maxwell
      </button>
      <br />
      <br />
      <div>MAINNET</div>
      <div>wss://rpc.crust.network</div>
      <div>
        CID (can view the status on apps.crust.network):
        QmYAAtzqGCDbUujmj2ULy3gT2P7rHXVh9XcTSt7Apquqm9
      </div>
      <button type="button" onClick={getStatusMainnet}>
        Get Status Maxwell
      </button>

      <br />
      <br />
      <h1>IPFS Example</h1>
      <input type="file" onChange={onChange} />
      {fileUrl && <div>{fileUrl}</div>}
    </div>
  );
}

export default App;
