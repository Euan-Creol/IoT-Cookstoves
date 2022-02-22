import { SyncOutlined } from "@ant-design/icons";
import { utils, Wallet } from "ethers";
import {Button, Divider, Input, Dropdown, Menu, Space, Row, Col, Typography, Calendar, Select, Radio} from "antd";
import { DownOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import { Address, Balance, Events } from "../components";
import {arrayify} from "@ethersproject/bytes";
import XLSX from 'xlsx';
import { JsonToTable } from "react-json-to-table";

export default function Upload({
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

  const onClickDeveloper = ({ key }) => {
    setNewAddress(key)
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
    </Menu>
  );

  const projectMethodologyDropdown = (
    <Menu onClick={onClickProjectMethodology}>
      <Menu.Item key={"GS-Cookstoves"}>
        Gold Standard - METHODOLOGY FOR METERED & MEASURED ENERGY COOKING DEVICES
      </Menu.Item>
    </Menu>
  );

  const methodologyDropdown = (
    <Menu onClick={onClickMethodology}>
      <Menu.Item key={"Fuel"}>
        Fuel Data
      </Menu.Item>
      <Menu.Item key={"Stove"}>
        Stove Data
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
    && newMethodology !== null
    && newVintageStart !== null
    && newVintageEnd !== null
    && newArweaveLink !== null) {
      return false
    } else {
      return true
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

  const { Text } = Typography;

  const [newMessage, setNewMessage] = useState(null);
  const [newAddress, setNewAddress] = useState(null);
  const [newAmount, setNewAmount] = useState(null);
  const [newNonce, setNewNonce] = useState(null);
  const [newProjectMethodology, setNewProjectMethodology] = useState(null);
  const [newMethodology, setNewMethodology] = useState(null);
  const [newFullSignature, setNewFullSignature] = useState('');
  const [newVintageStart, setNewVintageStart] = useState(null);
  const [newVintageEnd, setNewVintageEnd] = useState(null);
  const [newArweaveLink, setNewArweaveLink] = useState(null);
  const [newTokenIDs, setNewTokenIDs] = useState(null);
  const [newTokenID, setNewTokenID] = useState(null);
  const [newTokenData, setNewTokenData] = useState(null);
  const [newAddressTokens, setNewAddressTokens] = useState([]);

  return (
    <div>
      <h1>Upload Data</h1>
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
        <div style={{ margin: 8 }}>
          <Row>
            <h2>Select Existing NFT</h2>
          </Row>
          <Row>
            <button onClick={handleTokenLoading}>
              Load tokens
            </button>
          </Row>
          <Row>
            <Select placeholder="Tokens" defaultValue="" style={{ width: 120 }} onChange={(e) => {handleChange(e)}} >
              {newAddressTokens.map((tokenID) =>
                <Option key={tokenID.toNumber()} value={tokenID.toNumber()}>{tokenID.toNumber()}</Option>
              )}
            </Select>
          </Row>
          <Row>
            <h4>OR</h4>
          </Row>
          <Row>
              <h2>Create empty NFT</h2>
          </Row>
          <Row>
            <button onClick={async() => {
              const result = tx(writeContracts.TonMinter.mintEmptyVCU())
              result.then(async() => {
                const tokenIDs = tx(writeContracts.TonMinter.getTokenIDs(address))
                tokenIDs.then((tokenIDs) => {
                  setNewTokenIDs(tokenIDs)
                  setNewTokenID(tokenIDs[tokenIDs.length-1].toNumber())
                  const data = tx(writeContracts.TonMinter.getData(tokenIDs[tokenIDs.length-1].toNumber()))
                  data.then((data) => {
                    setNewTokenData(data)
                  })
                })
              })
            }}>
              Create
            </button>
          </Row>
          {newTokenData !== null &&
          <div>
            <Row>
              <Divider/>
            </Row>
            <div style={{border: "1px solid #cccccc", padding: 16, margin: "auto", marginTop: 32}}>
              <div style={{margin: 8}}>
                <Row>
                  <h2>Token Data</h2>
                </Row>
                <Row>
                  <h4>Token ID: {newTokenID}</h4>
                </Row>
                <Row>
                  <h4>Methodology: {newTokenData.methodology}</h4>
                </Row>
                <Row>
                  <h4>Project Developer: {newTokenData.projectDeveloper}</h4>
                </Row>
                <Row>
                  <h4>Verifier: {newTokenData.verifier}</h4>
                </Row>
                <Row>
                  <h4>Number of Tonnes: {newTokenData.quantity.toNumber()} tCO2e</h4>
                </Row>
                <Row>
                  <h4>Data Link: {newTokenData.dataLink}</h4>
                </Row>
                <Row>
                  <h4>Vintage Start: {newTokenData.vintageStart.toNumber()}</h4>
                </Row>
                <Row>
                  <h4>Vintage End: {newTokenData.vintageEnd.toNumber()}</h4>
                </Row>
                <Row>
                  <h4>Verifier Signature: {newTokenData.verifierSignature}</h4>
                </Row>
                <Row>
                  <h4>Status: {newTokenData.status}</h4>
                </Row>
              </div>
            </div>
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
          <Row>
            <Col span={22}>
              <Space direction="vertical">
                <Space wrap>
                  <Dropdown overlay={projectDeveloperDropdown} click placement="bottomCenter">
                    <h2>
                      <a className="ant-dropdown-link" style={{color: '#cccccc'}} onClick={e => e.preventDefault()}>
                        Project Developer <DownOutlined/>
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
          <Divider/>
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
                  <Space direction="vertical">
                    <Space wrap>
                      <Dropdown overlay={methodologyDropdown} click placement="bottomCenter">
                        <h2>
                          <a className="ant-dropdown-link" style={{color: '#cccccc'}} onClick={e => e.preventDefault()}>
                            Methodology <DownOutlined/>
                          </a>
                        </h2>
                      </Dropdown>
                    </Space>
                  </Space>
                  <h4>{newMethodology}</h4>
                </Col>
                <Col span={2}>
                  {displayIcon(newMethodology)}
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
                  <Calendar
                    fullscreen={false}
                    headerRender={({value, type, onChange, onTypeChange}) => {
                      const start = 0;
                      const end = 12;
                      const monthOptions = [];

                      const current = value.clone();
                      const localeData = value.localeData();
                      const months = [];
                      for (let i = 0; i < 12; i++) {
                        current.month(i);
                        months.push(localeData.monthsShort(current));
                      }

                      for (let index = start; index < end; index++) {
                        monthOptions.push(
                          <Select.Option className="month-item" key={`${index}`}>
                            {months[index]}
                          </Select.Option>,
                        );
                      }
                      const month = value.month();

                      const year = value.year();
                      const options = [];
                      for (let i = year - 10; i < year + 10; i += 1) {
                        options.push(
                          <Select.Option key={i} value={i} className="year-item">
                            {i}
                          </Select.Option>,
                        );
                      }
                      return (
                        <div style={{padding: 8}}>
                          <Row gutter={8}>
                            <Col>
                              <Radio.Group size="small" onChange={e => onTypeChange(e.target.value)} value={type}>
                                <Radio.Button value="month">Month</Radio.Button>
                                <Radio.Button value="year">Year</Radio.Button>
                              </Radio.Group>
                            </Col>
                            <Col>
                              <Select
                                size="small"
                                dropdownMatchSelectWidth={false}
                                className="my-year-select"
                                onChange={newYear => {
                                  const now = value.clone().year(newYear);
                                  onChange(now);
                                }}
                                value={String(year)}
                              >
                                {options}
                              </Select>
                            </Col>
                            <Col>
                              <Select
                                size="small"
                                dropdownMatchSelectWidth={false}
                                value={String(month)}
                                onChange={selectedMonth => {
                                  const newValue = value.clone();
                                  newValue.month(parseInt(selectedMonth, 10));
                                  onChange(newValue);
                                }}
                              >
                                {monthOptions}
                              </Select>
                            </Col>
                            <Col>
                              <button hidden={true} onClick={
                                setNewVintageStart(value.unix())
                              }>
                                Submit
                              </button>
                            </Col>
                          </Row>
                        </div>
                      );
                    }}
                  />
                </Col>
                <Col span={2}>
                  {displayIcon(newVintageStart)}
                </Col>
              </Row>
              <Divider/>
              <Row>
                <Col span={22}>
                  <h2>Vintage End</h2>
                  <Calendar
                    fullscreen={false}
                    headerRender={({value, type, onChange, onTypeChange}) => {
                      const start = 0;
                      const end = 12;
                      const monthOptions = [];

                      const current = value.clone();
                      const localeData = value.localeData();
                      const months = [];
                      for (let i = 0; i < 12; i++) {
                        current.month(i);
                        months.push(localeData.monthsShort(current));
                      }

                      for (let index = start; index < end; index++) {
                        monthOptions.push(
                          <Select.Option className="month-item" key={`${index}`}>
                            {months[index]}
                          </Select.Option>,
                        );
                      }
                      const month = value.month();

                      const year = value.year();
                      const options = [];
                      for (let i = year - 10; i < year + 10; i += 1) {
                        options.push(
                          <Select.Option key={i} value={i} className="year-item">
                            {i}
                          </Select.Option>,
                        );
                      }
                      return (
                        <div style={{padding: 8}}>
                          <Row gutter={8}>
                            <Col>
                              <Radio.Group size="small" onChange={e => onTypeChange(e.target.value)} value={type}>
                                <Radio.Button value="month">Month</Radio.Button>
                                <Radio.Button value="year">Year</Radio.Button>
                              </Radio.Group>
                            </Col>
                            <Col>
                              <Select
                                size="small"
                                dropdownMatchSelectWidth={false}
                                className="my-year-select"
                                onChange={newYear => {
                                  const now = value.clone().year(newYear);
                                  onChange(now);
                                }}
                                value={String(year)}
                              >
                                {options}
                              </Select>
                            </Col>
                            <Col>
                              <Select
                                size="small"
                                dropdownMatchSelectWidth={false}
                                value={String(month)}
                                onChange={selectedMonth => {
                                  const newValue = value.clone();
                                  newValue.month(parseInt(selectedMonth, 10));
                                  onChange(newValue);
                                }}
                              >
                                {monthOptions}
                              </Select>
                            </Col>
                            <Col>
                              <button hidden={true} onClick={
                                setNewVintageEnd(value.unix())
                              }>
                                Submit
                              </button>
                            </Col>
                          </Row>
                        </div>
                      );
                    }}
                  />
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
              <div style={{textAlign: "center"}}>
                <Button
                  disabled={enableDataSubmit()}
                  onClick={async () => {
                    const result = tx(writeContracts.TonMinter.updateCU(newTokenID, newProjectMethodology, newAmount, newVintageStart, newVintageEnd, newArweaveLink));
                    result.then(() => {
                      data = tx(writeContracts.TonMinter.getData(newTokenID))
                      data.then((data) => {
                        setNewTokenData(data)
                      })
                    })
                  }}
                >
                  Upload
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      }
    </div>
  )
}
