// import Navbar from "@/components/Navbar/navbar";
// import { PayBlock } from "@/components/Pay";
// import { SignIn } from "@/components/SignIn";
// import { VerifyBlock } from "@/components/Verify";

// export default function Home() {
//   return (
//     <main className="flex flex-col bg-white w-full h-screen">
//       <div className="h-[95vh]">
//         <h1 className="text-2xl text-black font-bold p-4">Events</h1>
//       </div>
//       <div className="h-[5vh]">
//         <Navbar />
//       </div>
//     </main>
//   );
// }

"use client";
import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  IndexService,
  decodeOnChainData,
  DataLocationOnChain,
} from "@ethsign/sp-sdk";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      <SignIn />
      <VerifyBlock />
      <PayBlock />
      <button
        onClick={async () => {
          const client = new SignProtocolClient(SpMode.OnChain, {
            chain: EvmChains.sepolia,
          });

          const attestationData = {
            businessName: "ABCD",
            transactionHash:
              "0x3e7b295215e5a7bf07b1d1ba3bf911917f52c88cfe04c204f9f5f6365b39cf99",
            invoiceDate: "1731369600",
            customer: "0x0AE6573813a73221d50bB32e4B4799c9AE7ec682",
            productName: "ABF-CD",
            category: "ugbuibo",
            quantity: "9",
            amount: "0",
            network: "sepolia",
          };

          const res = await client.createAttestation({
            schemaId: "0x268", // Replace with your actual schema ID
            data: attestationData,
            indexingValue: attestationData.customer, // Using customer address as indexing value
          });

          console.log(JSON.stringify(res));
        }}
      >
        Attest
      </button>
    </main>
  );
}