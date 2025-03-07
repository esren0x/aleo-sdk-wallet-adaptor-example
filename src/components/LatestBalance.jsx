import React, { useEffect, useState } from "react";

const LatestBalance = ({ userAddress }) => {
  const [balance, setBalance] = useState(0);

//   useEffect(() => {
//     // Create a network client using the explorer endpoint.
//     const networkClient = new AleoNetworkClient("https://api.explorer.provable.com/v1");
    
//     // Async function to fetch the balance.
//     const fetchBalance = async () => {
//       try {
//         // Query the mapping "credits.aleo" for the given address.
//         // You may need to adjust the mapping key based on your deployed program.
//         const public_balance = await networkClient.getMappingValue("credits.aleo", userAddress);
//         setBalance(public_balance);
//       } catch (error) {
//         console.error("Error fetching balance:", error);
//       }
//     };

//     if (userAddress) {
//       fetchBalance();
//     }
//   }, [userAddress]);

  return (
    <div>
      {balance !== null ? (
        <p>
          <strong>Balance:</strong> {balance} ALEO
        </p>
      ) : (
        <p>Loading balance...</p>
      )}
    </div>
  );
};

export default LatestBalance;
