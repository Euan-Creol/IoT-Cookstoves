import React, {useEffect, useState} from "react";
import {Address} from "../components";
import {Button, Col, Divider, Input, Row} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import { ethers } from "ethers";

export default function Admin({
                                   address,
                                   userSigner,
                                   mainnetProvider,
                                   localProvider,
                                   yourLocalBalance,
                                   price,
                                   tx,
                                   readContracts,
                                   writeContracts,
                                   data
                                 }) {

  function displayIcon(parameterInput) {
    if(parameterInput === null) {
      return <CloseCircleOutlined type="message" style={{ fontSize: '24px', color: '#08c' }} theme="outlined" />
    } else {
      return <CheckCircleOutlined type="message" style={{ fontSize: '24px', color: '#22CF21' }} theme="outlined"/>
    }
  }

  const [newApproveDeveloper, setNewApproveDeveloper] = useState(null);
  const [newRemoveDeveloper, setNewRemoveDeveloper] = useState(null);
  const [newCheckDeveloper, setNewCheckDeveloper] = useState(null);
  const [newIsDeveloper, setNewIsDeveloper] = useState(null);
  const [newApproveVerifier, setNewApproveVerifier] = useState(null);
  const [newRemoveVerifier, setNewRemoveVerifier] = useState(null);
  const [newCheckVerifier, setNewCheckVerifier] = useState(null);
  const [newIsVerifier, setNewIsVerifier] = useState(null);
  const [newAdminAddress, setNewAdminAddress] = useState(null);

  return (
    <div>
      <h1>Admin functions</h1>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
        <div>
          Your Address:
          <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        </div>
        <div>
          Contract Address:
          <Address
            address={readContracts && readContracts.TonMinter ? readContracts.TonMinter.address : null}
            ensProvider={mainnetProvider}
            fontSize={16}
          />
        </div>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
        <div>
          <Row>
            <Col span={22}>
              <h2>Initialize Smart Contract</h2>
              <Input
                placeholder="Admin address"
                onChange={e => {
                  setNewAdminAddress(e.target.value);

                }}
              />
            </Col>
            <Col span={2}>
              {displayIcon(newAdminAddress)}
            </Col>
          </Row>
          <div style={{textAlign: "center"}}>
            <Button
              onClick={async () => {
                const result = tx(writeContracts.TonMinter.initialize(newAdminAddress));
              }}
            >
              Approve
            </Button>
          </div>

        </div>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
        <div>
          <Row>
            <Col span={22}>
              <h2>Approve a Project Developer</h2>
              <Input
                onChange={e => {
                  setNewApproveDeveloper(e.target.value);
                }}
              />
            </Col>
            <Col span={2}>
              {displayIcon(newApproveDeveloper)}
            </Col>
          </Row>
          <div style={{textAlign: "center"}}>
            <Button
              onClick={async () => {
                const result = tx(writeContracts.TonMinter.addProjectDeveloper(newApproveDeveloper));
              }}
            >
              Approve
            </Button>
          </div>
          <Divider />
        </div>
        <div>
          <Row>
            <Col span={22}>
              <h2>Approve a Project Verifier</h2>
              <Input
                onChange={e => {
                  setNewApproveVerifier(e.target.value);
                }}
              />
            </Col>
            <Col span={2}>
              {displayIcon(newApproveVerifier)}
            </Col>
          </Row>
          <div style={{textAlign: "center"}}>
            <Button
              onClick={async () => {
                const result = tx(writeContracts.TonMinter.addVerifier(newApproveDeveloper));
              }}
            >
              Approve
            </Button>
          </div>
          <Divider />
        </div>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
        <div>
          <Row>
            <Col span={22}>
              <h2>Check a Project Developer</h2>
              <Input
                onChange={e => {
                  setNewCheckDeveloper(e.target.value);
                }}
              />
            </Col>
            <Col span={2}>
              {displayIcon(newCheckDeveloper)}
            </Col>
          </Row>
          <div style={{textAlign: "center"}}>
            <Button
              onClick={async () => {
                const result = tx(readContracts.TonMinter.isProjectDeveloper(newCheckDeveloper));
                result.then((projectDevBool) => {
                  setNewIsDeveloper(projectDevBool.toString());
                })
              }}
            >
              Check
            </Button>
            <h4>Status: {newIsDeveloper}</h4>
          </div>
          <Divider />
        </div>
        <div>
          <Row>
            <Col span={22}>
              <h2>Check a Project Verifier</h2>
              <Input
                onChange={e => {
                  setNewCheckVerifier(e.target.value);
                }}
              />
            </Col>
            <Col span={2}>
              {displayIcon(newCheckVerifier)}
            </Col>
          </Row>
          <div style={{textAlign: "center"}}>
            <Button
              onClick={async () => {
                const result = tx(writeContracts.TonMinter.isVerifier(newCheckVerifier));
                result.then((projectVerifierBool) => {
                  setNewIsVerifier(projectVerifierBool.toString())
                })
              }}
            >
              Check
            </Button>
            <h4>Status: {newIsVerifier}</h4>
          </div>
          <Divider />
        </div>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
        <div>
          <Row>
            <Col span={22}>
              <h2>Remove a Project Developer</h2>
              <Input
                onChange={e => {
                  setNewRemoveDeveloper(e.target.value);
                }}
              />
            </Col>
            <Col span={2}>
              {displayIcon(newRemoveDeveloper)}
            </Col>
          </Row>
          <div style={{textAlign: "center"}}>
            <Button
              onClick={async () => {
                const result = tx(writeContracts.TonMinter.removeProjectDeveloper(newRemoveDeveloper));
              }}
            >
              Remove
            </Button>
          </div>
          <Divider />
        </div>
        <div>
          <Row>
            <Col span={22}>
              <h2>Remove a Project Verifier</h2>
              <Input
                onChange={e => {
                  setNewRemoveVerifier(e.target.value);
                }}
              />
            </Col>
            <Col span={2}>
              {displayIcon(newRemoveVerifier)}
            </Col>
          </Row>
          <div style={{textAlign: "center"}}>
            <Button
              onClick={async () => {
                const result = tx(writeContracts.TonMinter.removeVerifier(newRemoveVerifier));
              }}
            >
              Remove
            </Button>
          </div>
          <Divider />
        </div>
      </div>
    </div>
  )
}
