import React, {useEffect, useState} from "react";
import {Address} from "../components";
import {Button, Col, Divider, Input, Row} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {arrayify} from "@ethersproject/bytes";

export default function Register({
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

  function enableDataSubmit() {
    return !(newStoveID !== null && newStoveGroupID !== null);
  }

  const [newStoveID, setNewStoveID] = useState(null);
  const [newStoveGroupID, setNewStoveGroupID] = useState(null);
  const [newAdmin, setNewAdmin] = useState(null);


  return (
    <div>
      <h1>Register a new device</h1>
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
            <Col span={10}>
              <h2>Stove Group ID</h2>
              <Input
                style={{marginRight:10}}
                onChange={e => {
                  setNewStoveGroupID(e.target.value);
                }}
              />
            </Col>
            <Col span={1}/>
            <Col span={10}>
              <h2>Stove ID</h2>
              <Input
                onChange={e => {
                  setNewStoveID(e.target.value);
                }}
              />
            </Col>
            <Col span={1}/>
            <Col span={2}>
              {displayIcon(newStoveGroupID && newStoveID)}
            </Col>
          </Row>
          <Divider />
          <div style={{textAlign: "center"}}>
            <Button
              disabled={enableDataSubmit()}
              onClick={async () => {
                const result = tx(writeContracts.TonMinter.addStoveID(newStoveID));
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
