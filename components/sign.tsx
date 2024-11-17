import React from "react";
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  IndexService,
  decodeOnChainData,
  DataLocationOnChain,
} from "@ethsign/sp-sdk";
const AttestationPage: React.FC = () => {
  const handleAttest = async () => {
    try {
      // Initialize the client with specified mode and chain
      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.scrollSepolia,
      });

      // Define the attestation data
      const attestationData = {
        name: "Bob",
        license: "101A",
        socialSecurityId: "AAA",
        supportingDoc: "QmSdqtGTZHHvfX81aFbMa5emfDHrFevXdPsUePavbcn34g",
      };

      // Create the attestation
      const res = await client.createAttestation({
        schemaId: "0x5b", // Replace with your actual schema ID
        data: attestationData,
        indexingValue: attestationData.license, // Using customer address as indexing value
      });

      // Log the result
      console.log(JSON.stringify(res));
    } catch (error) {
      console.error("Error creating attestation:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleAttest}
        className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
      >
        Attest
      </button>
    </div>
  );
};

export default AttestationPage;
