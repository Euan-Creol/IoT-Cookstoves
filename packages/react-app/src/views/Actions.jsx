import { SyncOutlined } from "@ant-design/icons";
import { utils, Wallet } from "ethers";
import {
  Button,
  Divider,
  Input,
  Dropdown,
  Menu,
  Space,
  Row,
  Col,
  Typography,
  Calendar,
  Select,
  Radio,
  Collapse,
  Card
} from "antd";
import { DownOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import { Address, Balance, Events } from "../components";
import {arrayify} from "@ethersproject/bytes";
import XLSX from 'xlsx';
import { JsonToTable } from "react-json-to-table";
import NFTDisplay from "../components/NFTDisplay";
import KLIMALogo from "../klima-logo.webp"
import C3Logo from "../c3_logo.png"

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
      <Row align={'center'}>
        <Col align={'center'} span={12}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
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
            </Card>
          </div>
        </Col>
      </Row>
      <Row align={'center'}>
        <Col align={'center'} span={12}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
               <div style={{ margin: 0 }}>
          <Collapse onChange={handleTokenLoading} ghost>
            <Panel header="Carbon batch" key="1" >
              <Row>
                <h1>Your carbon claims</h1>
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
            </Card>
          </div>
        </Col>
      </Row>
      {newTokenData !== null &&
        <div>
          <Row align={'center'}>
            <Col align={'center'} span={12}>
              <div>
                <Card style={{borderRadius: '0.8rem', margin: 16}}>
                  <div style={{margin: 8}}>
                    <Row>
                      <Col span={4}>
                        <img style={{maxWidth:'100%'}} src={C3Logo} alt={"C3 Logo"}/>
                      </Col>
                      <Col span={16}>
                        <h2>Fractionalize with C3</h2>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
          <Row align={'center'}>
            <Col align={'center'} span={12}>
              <div>
                {/*
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
              <div style={{margin: 8}}>
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
            </Card>
            */}
                <Card style={{borderRadius: '0.8rem', margin: 16}}>
                  <div style={{margin: 8}}>
                    <Row>
                      <Col span={4}>
                        <img style={{maxWidth:'100%'}} src={KLIMALogo} alt={"KLIMA Logo"}/>
                      </Col>
                      <Col span={16}>
                        <h2>Bond for KLIMA</h2>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      }
    </div>
  )
}
