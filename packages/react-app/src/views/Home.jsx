import React from "react";
import { Link } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import {Divider, Row, Col, Card} from "antd";
import projectDevImage from "../projectDevImage.webp"
import verifierImage from "../verifierImage.jpg"
import publicImage from "../publicImage.jpg"

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 */
function Home({ yourLocalBalance, readContracts }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  return (
    <div>
      <Row align={'center'}>
        <Col span={16}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
              <h2 style={{margin: 0}}>Make carbon more verifiable by bringing it on-chain</h2>
            </Card>
          </div>
        </Col>
      </Row>
      <Row align={'center'}>
        <Col span={16} align={'center'}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
              <Link to={'/upload'}>
              <Row align={'center'}>
                <Col span={1} align={'left'}/>
                <Col span={14} align={'left'}>
                  <h1 style={{margin: 0, fontSize: '40pt'}}>Project Developers</h1>
                  <h3 style={{margin: 0, color:'grey'}}>Provide data and create tons for verification</h3>
                </Col>
                <Col span={8}>
                  <img style={{borderRadius: '0.8rem', padding: 4, height: '150px'}} src={projectDevImage}/>
                </Col>
              </Row>
              </Link>
            </Card>
          </div>
        </Col>
      </Row>
      <Row align={'center'}>
        <Col span={16} align={'center'}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
              <Link to={'/verify'}>
              <Row align={'center'}>
                <Col span={8}>
                  <img style={{borderRadius: '0.8rem', padding: 4, height: '150px'}} src={verifierImage}/>
                </Col>
                <Col span={14} align={'right'}>
                  <h1 style={{margin: 0, fontSize: '40pt'}}>Verifiers</h1>
                  <h3 style={{margin: 0, color:'grey'}}>Verify data against methodology and approve tons</h3>
                </Col>
                <Col span={1} align={'left'}/>
              </Row>
              </Link>
            </Card>
          </div>
        </Col>
      </Row>
      <Row align={'center'}>
        <Col span={16} align={'center'}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
            <h2>Read our <Link to={'/faq'}>FAQs</Link></h2>
            </Card>
          </div>
        </Col>
      </Row>
      <Row align={'center'}>
        <Col span={16} align={'center'}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
              <Link to={'/check'}>
              <Row align={'center'}>
                <Col span={1} align={'left'}/>
                <Col span={14} align={'left'}>
                  <h1 style={{margin: 0, fontSize: '40pt'}}>Public</h1>
                  <h3 style={{margin: 0, color:'grey'}}>Anyone can verify the data behind tons minted on-chain. Don't trust, verify.</h3>
                </Col>
                <Col span={8}>
                  <img style={{borderRadius: '0.8rem', padding: 4, height: '150px'}} src={publicImage}/>
                </Col>
              </Row>
              </Link>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
