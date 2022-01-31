import { utils, Wallet } from "ethers";
import { Button, Divider, Input, Dropdown, Menu, Space, Row, Col } from "antd";
import { DownOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import { Address, Balance, Events } from "../components";
import XLSX, {read} from "xlsx";

export default function Mint({
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

  const onClick = ({ key }) => {
    setNewAddress(key)
  };

  //TO-DO change to actual wallets
  const verifierWallet = '0x2BaFF0a5838Aa1F03dEFe89a4086362fe31F6675' //Wallet.createRandom()

  //TO-DO change to actual wallets
  const ECSWallet = '0x55C9354F716188d3C937FC3C1569685B740bC8e3' //Wallet.createRandom()
  const ACEWallet = '0xB6FA19268D9bc22d1f92574505a5fac7622252Db' //Wallet.createRandom()

  const onClickProjectMethodology = ({ key }) => {
    setNewProjectMethodology(key)
    const result = tx(writeContracts.TonMinter.getDeveloperPendingTons(address))
    result.then((tons) => {
      setNewPendingTons(tons.toNumber())
    })
  };

  const onClickMethodology = ({ key }) => {
    setNewMethodology(key)
  };

  const projectDeveloperDropdown = (
    <Menu onClick={onClick}>
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
      && newFile !== null
      && newMethodology !== null
      && newStoveID !== null
      && newBurnTime !== null
      && newEmissionFactor !== null
      && newArweaveLink !== null
      && newFullSignature) {
      return false
    } else {
      return true
    }
  }

  const handleFile = (e) => {
    const content = e.target.result;
    //console.log('file content',  content)
    let workbook = XLSX.read(content, {
      type: 'binary'
    });
    workbook.SheetNames.forEach(function(sheetName) {
      // Here is your object
      let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      let json_object = JSON.stringify(XL_row_object);
      setNewFile(json_object)
    })
    // You can set content in state and show it in render.
  }

  const handleChangeFile = (file) => {
    let fileData = new FileReader();
    fileData.onloadend = handleFile;
    //fileData.readAsText(file);
    fileData.readAsBinaryString(file)
  }

  const [newAddress, setNewAddress] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [newAmount, setNewAmount] = useState(null);
  const [newNonce, setNewNonce] = useState(null);
  const [newSignature, setNewSignature] = useState(null);
  const [newFullSignature, setNewFullSignature] = useState(null);
  const [newVerifyResult, setNewVerifyResult] = useState('...');
  const [newProjectMethodology, setNewProjectMethodology] = useState(null);
  const [newMethodology, setNewMethodology] = useState(null);
  const [newMessageHash, setNewMessageHash] = useState(null);
  const [newStoveID, setNewStoveID] = useState(null);
  const [newValidStoveID, setNewValidStoveID] = useState(false);
  const [newBurnTime, setNewBurnTime] = useState(null);
  const [newEmissionFactor, setNewEmissionFactor] = useState(null);
  const [newArweaveLink, setNewArweaveLink] = useState(null);
  const [newApproveMint, setNewApproveMint] = useState(true);
  const [newPendingTons, setNewPendingTons] = useState(0);
  const [newTonsToMint, setNewTonsToMint] = useState(null);

  return (
    <div>
      <h1>Mint</h1>
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
        <div>
          Pending CO2e: {newPendingTons} Tons
        </div>
      </div>
      <div style={{ border: "1px solid #2faf49", padding: 16, width: 550, margin: "auto", marginTop: 32, textAlign: "left" }}>
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
          <Divider />
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
          <Divider />
          {newProjectMethodology === "GS-Cookstoves" && (
            <div>
              <Row>
                <Col span={22}>
                  <Space direction="vertical">
                    <Space wrap>
                      <Dropdown overlay={methodologyDropdown} click placement="bottomCenter" >
                        <h2>
                          <a className="ant-dropdown-link" style={{ color: '#cccccc' }} onClick={e => e.preventDefault()}>
                            Methodology <DownOutlined />
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
              <Divider />
              <Row>
                <Col span={22}>
                  <h2>Stove ID</h2>
                  <Input
                    onChange={e => {
                      const stoveID = parseInt(e.target.value)
                      setNewStoveID(stoveID)
                      if(!isNaN(stoveID)) {
                        const result = tx(writeContracts.TonMinter.getStoveID(parseInt(stoveID)))
                        result.then((stoveIDResult) => {
                          console.log(stoveIDResult)
                          setNewValidStoveID(stoveIDResult)
                        })
                      } else {
                        setNewValidStoveID(false)
                      }
                    }}
                  />
                </Col>
                <Col span={2}>
                  {displayIcon(newStoveID)}
                </Col>
              </Row>
              <Divider />
            </div>
          )}
          {newValidStoveID && (
            <div>
            <Divider />
              <div>
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
                <Divider />
                <Row>
                  <Col span={22}>
                    <h2>Emission factor</h2>
                    <Input
                      onChange={e => {
                        setNewEmissionFactor(e.target.value);
                      }}
                    />
                  </Col>
                  <Col span={2}>
                    {displayIcon(newEmissionFactor)}
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={22}>
                    <h2>Burn Time</h2>
                    <Input
                      onChange={e => {
                        setNewBurnTime(e.target.value);
                      }}
                    />
                  </Col>
                  <Col span={2}>
                    {displayIcon(newBurnTime)}
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={22}>
                    <h2>Batch Data</h2>
                      <input type="file" accept=".xlsx" onChange={e =>
                        handleChangeFile(e.target.files[0])} />
                      <h4>Or</h4>
                      <Input
                        placeholder="Arweave Link"
                        onChange={e => {
                          setNewFile(e.target.value);
                        }}
                      />
                  </Col>
                  <Col span={2}>
                    {displayIcon(newFile)}
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={22}>
                    <h2>Arweave Link</h2>
                    <Input
                      onChange={e => {
                        setNewArweaveLink(e.target.value);
                      }}
                    />
                  </Col>
                  <Col span={2}>
                    {displayIcon(newArweaveLink)}
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={22}>
                    <h2>Verifier's Signature</h2>
                    <Input
                      onChange={e => {
                        setNewFullSignature(e.target.value);
                      }}
                    />
                  </Col>
                  <Col span={2}>
                    {displayIcon(newFullSignature)}
                  </Col>
                </Row>
                <Divider />
                <div style={{textAlign: "center"}}>
                  <Button
                    style={{ marginTop: 8 }}
                    disabled={enableDataSubmit()}
                    onClick={async () => {
                      //const newMessage = newMethodology + newStoveID + newBurnTime + newEmissionFactor + newFile;
                      const tokenMetadata = {
                        "Project Methodology":newProjectMethodology,
                        "Methodology":newMethodology,
                        "Stove ID":newStoveID,
                        "Number of Tonnes":newAmount,
                        "Burn Time":newBurnTime,
                        "Emission Factor":newEmissionFactor,
                        "Data":newFile,
                        "Project Developer":newAddress,
                        "Verifier":verifierWallet,
                        "Arweave Link":newArweaveLink
                      }
                      const newNonce = 1;
                      setNewMessage(tokenMetadata)
                      setNewNonce(newNonce)
                      const result = tx(writeContracts.TonMinter.submitCarbonProof(
                        newStoveID,
                        newBurnTime,
                        newEmissionFactor,
                        verifierWallet,
                        newAddress,
                        newAmount,
                        tokenMetadata,
                        newNonce,
                        newFullSignature));
                      result.then(() => {
                        const pendingTons = tx(writeContracts.TonMinter.getDeveloperPendingTons(address))
                        pendingTons.then((tons) => {
                          setNewPendingTons(tons.toNumber())
                        })
                      })
                    }}
                  >
                    Submit Proof
                  </Button>
                  <h4>Pending CO2e: {newPendingTons} Tons</h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {newValidStoveID && (
        <div style={{ border: "1px solid #cccccc", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
          <h2>
            Mint Tonnage
          </h2>
          <Row>
            <Col span={22}>
              <h2>Number of Tons</h2>
              <Input
                onChange={e => {
                  setNewTonsToMint(e.target.value);
                }}
              />
            </Col>
            <Col span={2}>
              {displayIcon(newTonsToMint)}
            </Col>
          </Row>
          <Button
            //disabled={newApproveMint}
            onClick={async () => {
              tx(writeContracts.TonMinter.mintCVCU(newTonsToMint))
            }}
          >
            Mint
          </Button>
        </div>
      )}
    </div>
  )
}
