import React from "react";
import { Link } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import {Divider} from "antd";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Home({ yourLocalBalance, readContracts }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  return (
    <div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        A prototype app for project developers and verifiers to approve and mint tonnage
      </div>
      <Divider/>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
        <div style={{ margin: 32 }}>
          <h2>
            Access to the <Link to="/verify">Verifier Portal</Link>
          </h2>
        </div>
        <div style={{ margin: 32 }}>
          <h2>
            Access to the <Link to="/mint">Project Developer Portal</Link>
          </h2>
        </div>
      </div>
      <div style={{ margin: 16}}>
        Read our <Link to="/faq">FAQs</Link>
      </div>
    </div>
  );
}

export default Home;
