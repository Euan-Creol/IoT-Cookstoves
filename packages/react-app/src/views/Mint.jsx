import { utils, Wallet } from "ethers";
import { Button, Divider, Input, Dropdown, Menu, Space, Row, Col } from "antd";
import { DownOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import { Address, Balance, Events } from "../components";
import XLSX from "xlsx";

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

  function displayIcon(parameterInput) {
    if(parameterInput === null) {
      return <CloseCircleOutlined type="message" style={{ fontSize: '24px', color: '#08c' }} theme="outlined" />
    } else {
      return <CheckCircleOutlined type="message" style={{ fontSize: '24px', color: '#22CF21' }} theme="outlined"/>
    }
  }

  function enableDataSubmit() {
    if (newAddress !== null && newAmount !== null && newMessage !== null && newFullSignature !== null && newArweaveLink !== null) {
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
      console.log(XL_row_object)
      let json_object = JSON.stringify(XL_row_object);
      setNewMessage(json_object)
      console.log(json_object)
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
  const [newAmount, setNewAmount] = useState(null);
  const [newNonce, setNewNonce] = useState(null);
  const [newSignature, setNewSignature] = useState(null);
  const [newFullSignature, setNewFullSignature] = useState(null);
  const [newArweaveLink, setNewArweaveLink] = useState(null);
  const [newVerifyResult, setNewVerifyResult] = useState('...')
  const [newApproveMint, setNewApproveMint] = useState(true)

  return (
    <div>
      <h1>Mint</h1>
      <div style={{ border: "1px solid #2faf49", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
        <h2>
          Verify
        </h2>
        <div style={{ margin: 8 }}>
          <Row>
            <Col span={22}>
              <Space direction="vertical">
                <Space wrap>
                  <Dropdown overlay={projectDeveloperDropdown} click placement="bottomCenter" >
                    <h2>
                      <a className="ant-dropdown-link" style={{ color: '#cccccc' }} onClick={e => e.preventDefault()}>
                        Verifier <DownOutlined />
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
              <h2>Number of Tonnes</h2>
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
              <h2>Stove/Fuel Data</h2>
              <input type="file" accept=".xlsx" onChange={e =>
                handleChangeFile(e.target.files[0])} />
            </Col>
            <Col span={2}>
              {displayIcon(newMessage)}
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
        </div>
        <Button
          style={{ marginTop: 8 }}
          disabled={enableDataSubmit()}
          onClick={async () => {
            const newNonce = 1;
            setNewNonce(newNonce);
            const result = tx(writeContracts.Verifier.verify(address, newAddress, newAmount, newMessage, newNonce, newFullSignature));
            setNewVerifyResult(await result)
            setNewApproveMint(!result)
          }}
        >
          Verify
        </Button>
        <h4>Verify result: {newVerifyResult.toString()}</h4>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
        <h2>
          Mint Tonnage
        </h2>
        <Button
          disabled={newApproveMint}
          onClick={async () => {
            console.log("Mint")
          }}
        >
          Mint
        </Button>
      </div>
    </div>
  )
}
