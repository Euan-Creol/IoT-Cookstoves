import React from "react";
import { Link } from "react-router-dom";
import {Card, Col, Row} from "antd";
import projectDevImage from "../projectDevImage.webp";
import verifierImage from "../verifierImage.jpg";

export default function ProjectDev({
                               }) {
  return (
    <div>
      <h1>Project Developer</h1>
      <Row align={'center'}>
        <Col span={16} align={'center'}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
              <Link to={'/upload'}>
                <Row align={'center'}>
                  <Col span={1} align={'left'}/>
                  <Col span={14} align={'left'}>
                    <h1 style={{margin: 0, fontSize: '40pt'}}>Upload data</h1>
                    <h3 style={{margin: 0, color:'grey'}}>Submit data to create e a new carbon batch</h3>
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
              <Link to={'/actions'}>
                <Row align={'center'}>
                  <Col span={8}>
                    <img style={{borderRadius: '0.8rem', padding: 4, height: '150px'}} src={verifierImage}/>
                  </Col>
                  <Col span={14} align={'right'}>
                    <h1 style={{margin: 0, fontSize: '40pt'}}>Actions</h1>
                    <h3 style={{margin: 0, color:'grey'}}>Choose what to do with your approved tons</h3>
                  </Col>
                  <Col span={1} align={'left'}/>
                </Row>
              </Link>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  )
}
