import { SyncOutlined } from "@ant-design/icons";
import { utils, Wallet } from "ethers";
import {Button, Divider, Input, Dropdown, Menu, Space, Row, Col, Typography, Calendar, Select, Radio, Collapse} from "antd";
import { DownOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import { Address, Balance, Events } from "../components";
import {arrayify} from "@ethersproject/bytes";
import XLSX from 'xlsx';
import { JsonToTable } from "react-json-to-table";
import NFTDisplay from "../components/NFTDisplay";

export default function Actions({
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


  function handleTokenLoading() {
    const data = tx(writeContracts.TonMinter.getTokenIDs(address))
    data.then((data) => {
      setNewAddressTokens(data)
    })
  }

  function handleChange(e) {
    setNewTokenID(e)
    const data = tx(writeContracts.TonMinter.getData(e))
    data.then((data) => {
      setNewTokenData(data)
    })
  }

  const {Option} = Select;
  const { Panel } = Collapse;

  const { Text } = Typography;

  const [newTokenID, setNewTokenID] = useState(null);
  const [newTokenData, setNewTokenData] = useState(null);
  const [newURI, setNewURI] = useState(null);
  const [newAddressTokens, setNewAddressTokens] = useState([]);

  return (
    <div>
      <h1>Actions</h1>
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
        <div style={{ margin: 0 }}>
          <Collapse onChange={handleTokenLoading} ghost>
            <Panel header="Carbon container" key="1" >
              <Row>
                <h2>Select container</h2>
              </Row>
              <Row>
                <Select placeholder="Tokens" defaultValue="" style={{ width: 120 }} onChange={(e) => {handleChange(e)}} >
                  {newAddressTokens.map((tokenID) =>
                    <Option key={tokenID.toNumber()} value={tokenID.toNumber()}>{tokenID.toNumber()}</Option>
                  )}
                </Select>
              </Row>
            </Panel>
          </Collapse>
          {newTokenData !== null &&
          <div>
            <NFTDisplay tokenID={newTokenID} tokenData={newTokenData}/>
          </div>
          }
        </div>
      </div>
      {newTokenData !== null &&
      <div style={{
        border: "1px solid #cccccc",
        padding: 16,
        width: 550,
        margin: "auto",
        marginTop: 32,
        textAlign: "left"
      }}>
        <div style={{margin: 8}}>
          <Divider/>
          <Row>
            <Col span={22}>
              <h2>Set Token URI</h2>
              <Input
                onChange={e => {
                  setNewURI(e.target.value);
                }}
              />
            </Col>
            <Col span={2}>
              {displayIcon(newURI)}
            </Col>
          </Row>
          <Row>
            <button onClick={() => {
              const result = tx(writeContracts.TonMinter.setMetadata(newTokenID, newURI))
            }}>
              Apply
            </button>
          </Row>
          <Divider/>
          <Row>
            <Col span={22}>
              <h2>Fractionalize approved token</h2>
            </Col>
          </Row>
          <Row>
            <button onClick={() => {
              console.log("TBC")
            }}>
              Fractionalize
            </button>
          </Row>
      </div>
    </div>
      }
    </div>
  )
}
