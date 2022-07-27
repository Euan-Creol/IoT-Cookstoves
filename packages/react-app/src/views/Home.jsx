
import { Link } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import {Divider, Row, Col, Card} from "antd";
import projectDevImage from "../projectDevImage.jpg"
import verifierImage from "../verifierImage.jpg"
import publicImage from "../publicImage.jpg"
import ImageButton from "../components/ImageButton";
import FeaturedImage from "../components/FeaturedImage"
import SplashImage from "../ACE-1-customer.png"

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
        <Col span={20} align={'center'}>
          <h2>Featured Project</h2>
          <FeaturedImage image={SplashImage} />
        </Col>
        <Col span={16}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
              <h2 style={{margin: 0}}>An open approach to carbon</h2>
            </Card>
          </div>
        </Col>
      </Row>
      <ImageButton
        title="Project Developers"
        description="Provide data and create tons for verification"
        image={projectDevImage}
        link='/project-developer'
        imageAlign="right"
      />
      <ImageButton
        title="Verifiers"
        description="Verify data against methodology and approve tons"
        image={verifierImage}
        link='/verify'
        imageAlign="left"
      />
      <Row align={'center'}>
        <Col span={16} align={'center'}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
            <h2>Read our <Link to={'/faq'}>FAQs</Link></h2>
            </Card>
          </div>
        </Col>
      </Row>
      <ImageButton
        title="Public"
        description="Anyone can verify the data behind CLNK tons. Don't trust, verify."
        image={publicImage}
        link='/check'
        imageAlign="right"
      />
    </div>
  );
}

export default Home;
