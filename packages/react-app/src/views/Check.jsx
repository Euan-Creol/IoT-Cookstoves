import { SyncOutlined } from "@ant-design/icons";
import { utils, Wallet } from "ethers";
import {Button, Divider, Input, Dropdown, Menu, Space, Row, Col, Typography, Calendar, Select, Radio, Card} from "antd";
import { DownOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import { Address, Balance, Events } from "../components";
import {arrayify} from "@ethersproject/bytes";
import XLSX from 'xlsx';
import { JsonToTable } from "react-json-to-table";
import NFTDisplay from "../components/NFTDisplay";

export default function Check({
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

  //TO-DO change to actual wallets
  const ECSWallet = '0x55C9354F716188d3C937FC3C1569685B740bC8e3' //Wallet.createRandom()
  const ACEWallet = '0xB6FA19268D9bc22d1f92574505a5fac7622252Db' //Wallet.createRandom()
  const localHostWallet = '0x2BaFF0a5838Aa1F03dEFe89a4086362fe31F6675'
  const mumbaiTestWallet = '0x886fE4aFE723B73a0804c2c5158DE3a7e6Ef4535'

  const onClickDeveloper = ({ key }) => {
    setNewAddress(key)
    handleTokenLoading(key)
  };

  const onClickProjectMethodology = ({ key }) => {
    setNewProjectMethodology(key)
  };

  const onClickMethodology = ({ key }) => {
    setNewMethodology(key)
  };

  const projectDeveloperDropdown = (
    <Menu onClick={onClickDeveloper}>
      <Menu.Item key={ECSWallet}>
        ECS
      </Menu.Item>
      <Menu.Item key={ACEWallet}>
        ACE
      </Menu.Item>
      <Menu.Item key={localHostWallet}>
        LocalHost
      </Menu.Item>
      <Menu.Item key={mumbaiTestWallet}>
        Mumbai
      </Menu.Item>
    </Menu>
  );

  const projectMethodologyDropdown = (
    <Menu onClick={onClickProjectMethodology}>
      <Menu.Item key={"GS-Cookstoves"}>
        Gold Standard - METHODOLOGY FOR METERED & MEASURED ENERGY COOKING DEVICES
      </Menu.Item>
    </Menu>
  );

  function displayIcon(parameterInput) {
    if(parameterInput === null) {
      return <CloseCircleOutlined type="message" style={{ fontSize: '24px', color: '#08c' }} theme="outlined" />
    } else {
      return <CheckCircleOutlined type="message" style={{ fontSize: '24px', color: '#22CF21' }} theme="outlined"/>
    }
  }

  function enableDataSubmit() {
    if (newAddress !== null
      && newAmount !== null
      && newProjectMethodology !== null
      && newVintageStart !== null
      && newVintageEnd !== null
      && newArweaveLink !== null) {
      return false
    } else {
      return true
    }
  }

  function handleTokenLoading(projectDeveloperAddress) {
    const data = tx(writeContracts.TonMinter.getTokenIDs(projectDeveloperAddress))
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

  const { Text } = Typography;

  const [newMessage, setNewMessage] = useState(null);
  const [newAddress, setNewAddress] = useState(null);
  const [newVerifier, setNewVerifier] = useState(null);
  const [newAmount, setNewAmount] = useState(null);
  const [newNonce, setNewNonce] = useState(null);
  const [newProjectMethodology, setNewProjectMethodology] = useState(null);
  const [newMethodology, setNewMethodology] = useState(null);
  const [newMessageHash, setNewMessageHash] = useState(null);
  const [newFullSignature, setNewFullSignature] = useState('');
  const [newStoveID, setNewStoveID] = useState(null);
  const [newVintageStart, setNewVintageStart] = useState(null);
  const [newVintageEnd, setNewVintageEnd] = useState(null);
  const [newArweaveLink, setNewArweaveLink] = useState(null);
  const [newTokenIDs, setNewTokenIDs] = useState(null);
  const [newTokenID, setNewTokenID] = useState(null);
  const [newTokenData, setNewTokenData] = useState(null);
  const [newAddressTokens, setNewAddressTokens] = useState(null);
  const [newVerifierSignature, setNewVerifierSignature] = useState(null);
  const [newVerifyResult, setNewVerifyResult] = useState(null);

  return (
    <div>
      <h1>Check</h1>
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
              <div style={{ margin: 8 }}>
          <Row>
            <Col span={22}>
              <Space direction="vertical">
                <Space wrap>
                  <Dropdown overlay={projectDeveloperDropdown} click placement="bottomCenter" >
                    <h2>
                      <a className="ant-dropdown-link" style={{ color: '#cccccc' }} onClick={e => e.preventDefault()}>
                        Project Developer <DownOutlined />
                      </a>
                    </h2>
                  </Dropdown>
                </Space>
              </Space>
              <h4>{newAddress}</h4>
            </Col>
            <Col span={2}>
              {displayIcon(newAddress)}
            </Col>
          </Row>
        </div>
            </Card>
          </div>
        </Col>
      </Row>
      {newAddressTokens !== null && (
        <Row align={'center'}>
          <Col align={'center'} span={12}>
            <div>
              <Card style={{borderRadius: '0.8rem', margin: 16}}>
                <div style={{ margin: 8 }}>
            <Row>
              <h2>Select Existing Batch</h2>
            </Row>
            <Row>
              <Select placeholder="Tokens" defaultValue="" style={{ width: 120 }} onChange={(e) => {handleChange(e)}} >
                {newAddressTokens.map((tokenID) =>
                  <Option key={tokenID.toNumber()} value={tokenID.toNumber()}>{tokenID.toNumber()}</Option>
                )}
              </Select>
            </Row>
            {newTokenData !== null &&
            <div>
              <Row>
                <Divider/>
              </Row>
              <div>
                <NFTDisplay tokenID={newTokenID} tokenData={newTokenData}/>
              </div>
            </div>
            }
          </div>
              </Card>
            </div>
          </Col>
        </Row>
      )}
      {newTokenData !== null &&
      <Row align={'center'}>
        <Col align={'center'} span={12}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
              <div style={{margin: 8}}>
          <Row>
            <Col span={22}>
              <Space direction="vertical">
                <Space wrap>
                  <Dropdown overlay={projectMethodologyDropdown} click placement="bottomCenter">
                    <h2>
                      <a className="ant-dropdown-link" style={{color: '#cccccc'}} onClick={e => e.preventDefault()}>
                        Project Methodology <DownOutlined/>
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
          <Divider/>
          {newProjectMethodology === "GS-Cookstoves" && (
            <div>
              <Row>
                <Col span={22}>
                  <h2>Verifier</h2>
                  <Input
                    onChange={e => {
                      setNewVerifier(e.target.value);
                    }}
                  />
                </Col>
                <Col span={2}>
                  {displayIcon(newVerifier)}
                </Col>
              </Row>
              <Divider/>
              <Row>
                <Col span={22}>
                  <h2>Amount of Carbon (tons CO2e)</h2>
                  <Input
                    onChange={e => {
                      setNewAmount(e.target.value);
                    }}
                  />
                </Col>
                <Col span={2}>
                  {displayIcon(newAmount)}
                </Col>
              </Row>
              <Divider/>
              <Row>
                <Col span={22}>
                  <h2>Vintage Start</h2>
                  <Input placeholder="UNIX Time" onChange={e => {
                    setNewVintageStart(e.target.value)
                  }}/>
                </Col>
                <Col span={2}>
                  {displayIcon(newVintageStart)}
                </Col>
              </Row>
              <Divider/>
              <Row>
                <Col span={22}>
                  <h2>Vintage End</h2>
                  <Input placeholder="UNIX Time" onChange={e => {
                    setNewVintageEnd(e.target.value)
                  }}/>
                </Col>
                <Col span={2}>
                  {displayIcon(newVintageEnd)}
                </Col>
              </Row>
              <Divider/>
              <Row>
                <Col span={22}>
                  <h2>Arweave Link</h2>
                  <Input
                    placeholder="Arweave Link"
                    onChange={e => {
                      setNewArweaveLink(e.target.value);
                    }}
                  />
                </Col>
                <Col span={2}>
                  {displayIcon(newArweaveLink)}
                </Col>
              </Row>
              <Row>
                <Col span={22}>
                  <div>
                    How to upload to Arweave >
                  </div>
                </Col>
                <Col span={2}/>
              </Row>
              <Divider/>
              <Row>
                <Col span={22}>
                  <h2>Signature</h2>
                  <Input
                    placeholder="Verifier's Signature"
                    onChange={e => {
                      setNewVerifierSignature(e.target.value);
                    }}
                  />
                </Col>
                <Col span={2}>
                  {displayIcon(newVerifierSignature)}
                </Col>
              </Row>
              <Divider/>
              <div style={{textAlign: "center"}}>
                <Button
                  disabled={enableDataSubmit()}
                  onClick={async () => {
                    const tokenMetadata = {
                      "Project Methodology": newProjectMethodology,
                      "Project Developer": newAddress,
                      "Verifier": newVerifier,
                      "Number of Tonnes": newAmount,
                      "Vintage Start": newVintageStart,
                      "Vintage End": newVintageEnd,
                      "Arweave Link": newArweaveLink
                    }
                    setNewMessage(tokenMetadata)
                    //Hash the message
                    console.log(typeof newVerifier, typeof newAddress, typeof newAmount, typeof newMessage, typeof newTokenID, typeof newVerifierSignature)
                    const verify = tx(writeContracts.TonMinter.verify(newVerifier, newAddress, newAmount, newMessage, newTokenID, newVerifierSignature))
                    verify.then((result) => {
                      if (typeof result == "boolean"){
                        setNewVerifyResult(result.toString())
                      }
                    })
                  }}
                >
                  Check
                </Button>
                <h3>Result: {newVerifyResult}</h3>
              </div>
            </div>
          )}
        </div>
            </Card>
          </div>
        </Col>
      </Row>
      }
    </div>
  )
}
