import { SyncOutlined } from "@ant-design/icons";
import { utils, Wallet } from "ethers";
import {Button, Divider, Input, Dropdown, Menu, Space, Row, Col, Typography, Table} from "antd";
import { DownOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import { Address, Balance, Events } from "../components";
import {arrayify} from "@ethersproject/bytes";
import XLSX from 'xlsx';
import { JsonToTable } from "react-json-to-table";

export default function Verify({
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
    if (newAddress !== null && newAmount !== null && newMessage !== null) {
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

  const tableColumns = [
    {
      title: 'Row',
      dataIndex: 'Row',
      key: 'Row',
    },
    {
      title: 'entryCount',
      dataIndex: 'entryCount',
      key: 'entryCount',
    },
    {
      title: 'entryDate',
      dataIndex: 'entryDate',
      key: 'entryDate',
    },
    {
      title: 'timeStamp',
      dataIndex: 'timeStamp',
      key: 'timeStamp',
    },
    {
      title: 'fanSeconds',
      dataIndex: 'fanSeconds',
      key: 'fanSeconds',
    },
    {
      title: 'usbLampSeconds',
      dataIndex: 'usbLampSeconds',
      key: 'usbLampSeconds',
    },
    {
      title: 'usbPhoneSeconds',
      dataIndex: 'usbPhoneSeconds',
      key: 'usbPhoneSeconds',
    },
    {
      title: 'battVoltage',
      dataIndex: 'battVoltage',
      key: 'battVoltage',
    },
    {
      title: 'inpVoltage',
      dataIndex: 'inpVoltage',
      key: 'inpVoltage',
    },
    {
      title: 'version',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'remainingCredit',
      dataIndex: 'remainingCredit',
      key: 'remainingCredit',
    },
    {
      title: 'sequenceNumber',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
    },
    {
      title: 'chargeCurrent',
      dataIndex: 'chargeCurrent',
      key: 'chargeCurrent',
    },
    {
      title: 'potMeter',
      dataIndex: 'potMeter',
      key: 'potMeter',
    },
    {
      title: 'event',
      dataIndex: 'event',
      key: 'event',
    },
    {
      title: 'paymentScheme',
      dataIndex: 'paymentScheme',
      key: 'paymentScheme',
    },
    {
      title: 'stoveBookId',
      dataIndex: 'stoveBookId',
      key: 'stoveBookId',
    },
    {
      title: 'customerId',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'controllerId',
      dataIndex: 'controllerId',
      key: 'controllerId',
    },
    {
      title: 'uploadDate',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
    {
      title: 'uploadSource',
      dataIndex: 'uploadSource',
      key: 'uploadSource',
    },
  ];

  const { Text } = Typography;

  const [newMessage, setNewMessage] = useState(null);
  const [newAddress, setNewAddress] = useState(null);
  const [newAmount, setNewAmount] = useState(null);
  const [newNonce, setNewNonce] = useState(null);
  const [newMethodology, setNewMethodology] = useState(null);
  const [newMessageHash, setNewMessageHash] = useState(null);
  const [newFullSignature, setNewFullSignature] =useState('')
  const [newVerifyResult, setNewVerifyResult] = useState('...')

  return (
    <div>
      <h1>Verify</h1>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
        <div>
          Your Address:
          <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        </div>
        <div>
          Contract Address:
          <Address
            address={readContracts && readContracts.Verifier ? readContracts.Verifier.address : null}
            ensProvider={mainnetProvider}
            fontSize={16}
          />
        </div>
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
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
          <Button
            disabled={enableDataSubmit()}
            onClick={async () => {
              const newNonce = 1;
              setNewNonce(newNonce)
              //Hash the message
              const result = tx(writeContracts.Verifier.getMessageHash(newAddress, parseInt(newAmount), newMessage, parseInt(newNonce)));
              setNewMessageHash(await result)
              result.then((messageHash) => {
                //Sign the message hash
                let signPromise = userSigner.signMessage(arrayify(messageHash))
                signPromise.then((signature) => {
                  setNewFullSignature(signature)})
              })
            }}
          >
            Sign data
          </Button>
          <div>
            <Text copyable={{ text: newFullSignature }}>
              <a
                target="_blank"
                rel="noopener noreferrer"
              >
                {newFullSignature.slice(0,5) + '...' + newFullSignature.slice((newFullSignature.length)-5,newFullSignature.length)}
              </a>
            </Text>
          </div>
        </div>
      </div>
      <div style={{ border: "1px solid #dddddd", padding: 16, width: 550, margin: "auto", marginTop: 32 }}>
        <h2>
          Submit proof to Arweave
        </h2>
        <Button>
          Submit proof
        </Button>
      </div>
      <Events
        contracts={readContracts}
        contractName="Verifier"
        eventName="dataHashed"
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        startBlock={1}
      />
    </div>
  )
}
