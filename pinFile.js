const got = require("got");

const ipfsPinningService = "https://pin.crustcode.com/psa"; // IPFS Web3 Authed Pinning Service address

const authHeader = Buffer.from(
  // `pol-0x272a8f05d05d69b6d8261538b031ffac60ba0c8c:0xd25e6494e0ad7988815f07670d1a0133150b039a5a796efea50f72cde520731354fbf4fac099e81a346abf76d7d8f0fb7cabbfa3a17d5d2829d1a85aa607884e1c`
  `sub-5EoX3ZVUSKbQHqkuvCWvintEnqeAXWdiMer6yP23EE9oajt5:0xe8a9fe4209d477cadfdba2ce5a4446c49589b39154a643fc9bfc6b55d35cdd15be8cf6d23ea84d441dd1226e2f05158a6f24a6a30cf051cab2d40788a6e89e0f`
).toString("base64");

const main = async () => {
  // 4. Pin to crust with IPFS standard W3Authed pinning service
  const { body } = await got.post(ipfsPinningService + "/pins", {
    headers: {
      authorization: "Bearer " + authHeader,
    },
    json: {
      cid: "QmYZ2D55Ps8gHziWJdB6q9iwtUSYnWC3MoAAgBwVJeznkb",
      name: "crust-demo",
    },
  });
  console.log(body);
};

main();
