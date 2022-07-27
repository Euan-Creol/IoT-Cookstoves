import React from "react";
import { Link } from "react-router-dom";
import {Row, Col, Card} from "antd";

function ImageButton({title, description, image, link, imageAlign}) {
    if(imageAlign === "left") {
        return (
            <Row align={'center'}>
        <Col span={16} align={'center'}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
              <Link to={link}>
              <Row align={'center'}>
                <Col span={8}>
                  <img style={{borderRadius: '0.8rem', height: '150px'}} src={image}/>
                </Col>
                <Col span={14} align={'right'}>
                  <h1 style={{margin: 0, fontSize: '40pt', paddingBottom: 5}}>{title}</h1>
                  <h3 style={{margin: 0, paddingLeft: 20, color:'grey'}}>{description}</h3>
                </Col>
                <Col span={1} align={'left'}/>
              </Row>
              </Link>
            </Card>
          </div>
        </Col>
      </Row>
        )
    } else if(imageAlign === "right") {
        return (
            <Row align={'center'}>
        <Col span={16} align={'center'}>
          <div>
            <Card style={{borderRadius: '0.8rem', margin: 16}}>
              <Link to={link}>
              <Row align={'center'}>
                <Col span={1} align={'left'}/>
                <Col span={14} align={'left'}>
                  <h1 style={{margin: 0, fontSize: '40pt', paddingBottom: 5}}>{title}</h1>
                  <h3 style={{margin: 0, paddingRight: 20, color:'grey'}}>{description}</h3>
                </Col>
                <Col span={8}>
                  <img style={{borderRadius: '0.8rem',height: '150px'}} src={image}/>
                </Col>
              </Row>
              </Link>
            </Card>
          </div>
        </Col>
      </Row>
        )
    }
    
}
export default ImageButton