import React, {useEffect, useState} from "react";
import {Address} from "../components";
import {Button, Col, Divider, Input, Row} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {arrayify} from "@ethersproject/bytes";

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

  const [newStoveID, setNewStoveID] = useState(null);
  const [newStoveGroupID, setNewStoveGroupID] = useState(null);
  const [newAdmin, setNewAdmin] = useState(null);
  const [newApproveDeveloper, setNewApproveDeveloper] = useState(null);
  const [newRemoveDeveloper, setNewRemoveDeveloper] = useState(null);
  const [newApproveVerifier, setNewApproveVerifier] = useState(null);
  const [newRemoveVerifier, setNewRemoveVerifier] = useState(null);


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
                const result = tx(writeContracts.TonMinter.addValidVerifier(newApproveDeveloper));
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
                const result = tx(writeContracts.TonMinter.removeValidVerifier(newRemoveVerifier));
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
