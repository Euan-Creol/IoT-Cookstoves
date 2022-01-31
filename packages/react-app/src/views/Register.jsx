import React, {useEffect, useState} from "react";
import {Address} from "../components";
import {Button, Col, Divider, Dropdown, Input, Menu, Row, Space} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, DownOutlined} from "@ant-design/icons";
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

  const onClickProjectMethodology = ({ key }) => {
    setNewProjectMethodology(key)
  };

  const projectMethodologyDropdown = (
    <Menu onClick={onClickProjectMethodology}>
      <Menu.Item key={"GS-Cookstoves"}>
        Gold Standard - METHODOLOGY FOR METERED & MEASURED ENERGY COOKING DEVICES
      </Menu.Item>
    </Menu>
  );

  function enableDataSubmit() {
    return !(newStoveID !== null);
  }

  function enableDataCheck() {
    return !(newCheckStoveID !== null);
  }

  const [newStoveID, setNewStoveID] = useState(null);
  const [newCheckStoveID, setNewCheckStoveID] = useState(null);
  const [newCheckStoveIDBool, setNewCheckStoveIDBool] = useState(null);
  const [newProjectMethodology, setNewProjectMethodology] = useState(null);


  return (
    <div>
      <h1>Register device</h1>
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
              <Space direction="vertical">
                <Space wrap>
                  <Dropdown overlay={projectMethodologyDropdown} click placement="bottomCenter" >
                    <h2>
                      <a className="ant-dropdown-link" style={{ color: '#cccccc' }} onClick={e => e.preventDefault()}>
                        Project Methodology <DownOutlined />
                      </a>
                    </h2>
                  </Dropdown>
                </Space>
              </Space>
              <h4>{newProjectMethodology}</h4>
            </Col>
            <Col span={2}>
              {displayIcon(newProjectMethodology)}
            </Col>
          </Row>
        </div>
      </div>
      {newProjectMethodology === "GS-Cookstoves" && (
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
        <div>
          <Row>
            <Col span={22}>
              <h2>Stove ID</h2>
              <Input
                onChange={e => {
                  setNewStoveID(e.target.value);
                }}
              />
            </Col>
            <Col span={2}>
              {displayIcon(newStoveID)}
            </Col>
          </Row>
          <Divider />
          <div style={{textAlign: "center"}}>
            <Button
              disabled={enableDataSubmit()}
              onClick={async () => {
                const result = tx(writeContracts.TonMinter.addStoveID(parseInt(newStoveID)));
              }}
            >
              Submit
            </Button>
          </div>
          <Divider/>
          <h2>Check Device</h2>
          <Row>
            <Col span={22}>
              <h2>Stove ID</h2>
              <Input
                onChange={e => {
                  setNewCheckStoveID(e.target.value);
                }}
              />
            </Col>
            <Col span={2}>
              {displayIcon(newCheckStoveID)}
            </Col>
          </Row>
          <Divider />
          <div style={{textAlign: "center"}}>
            <Button
              disabled={enableDataCheck()}
              onClick={async () => {
                const projDev = tx(writeContracts.TonMinter.getStoveID(parseInt(newCheckStoveID)))
                projDev.then((result) => {
                  setNewCheckStoveIDBool(result.toString())
                })
              }}
            >
              Check
            </Button>
            <h4>Status: {newCheckStoveIDBool}</h4>
          </div>
        </div>
      </div>
      )}

    </div>
  )
}
