import React from "react";
import { Divider } from "antd";

export default function FAQs({

}) {
  return (
    <div>
      <h1>
        FAQs
      </h1>
      <Divider/>
      <h2>What is this DApp?</h2>
      <div style={{ marginLeft: 64, marginRight: 64 }}>
        This DApp allows project developers and trusted verifiers to approve tonnage, mint on-chain and provide embedded proof of approval within each ton.
      </div>
      <Divider/>
      <h2>Why put carbon tons on-chain?</h2>
      <div style={{ marginLeft: 64, marginRight: 64 }}>
        The traditional carbon markets are due for an upgrade; traditional registries and developers still use spreadsheets to keep track of tons, leading to 'double spend' problems, poor traceability and limited transparency. On top of this, the long lead times required by traditional registries make many innovative and beneficial projects financially infeasible. By natively minting tons on-chain, we can open new financial avenues for projects by making approved tons instantly monetizable, improve the verifiability of tons by making the supporting data open and scrutinizable as well as being immediately compatible with liquid carbon markets thanks to Toucan Protocol's pools and Klima DAO's bonding mechanics.
      </div>
      <Divider/>
      <h2>What does tonnage approval mean and who does it?</h2>
      <div style={{ marginLeft: 64, marginRight: 64 }}>
        A trusted independent third party will check that the data provided matches the claimed number of tons, based on an established methodology. A verifier is yet to be selected but TradFi organisations (e.g. EY) who already perform this role for other projects are our preferred partners.
      </div>
      <Divider/>
      <h2>What kind of projects does this verification DApp support?</h2>
      <div style={{ marginLeft: 64, marginRight: 64 }}>
        This method of approval only works if the methodology employed is data-driven. A great example of this is the Gold Standard Clean Cookstove Methodology, in which data from the stoves themselves can be sent directly to the verifiers, approval can then be issued contingent on the validity of the underlying data.
      </div>
      <Divider/>
      <h2>How do you ensure data integrity?</h2>
      <div style={{ marginLeft: 64, marginRight: 64 }}>
        To ensure data from a given device is valid and has not been tampered with, we are partnering with Cartesi to sign data and provide proofs to validate data integrity. The clever thing about Cartesi is that is allows you to check whether the signature itself has been tampered with. These proofs will all be used to ensure tonnage integrity and will be available on-chain for anyone to validate the results.
      </div>
    </div>
  )
}
