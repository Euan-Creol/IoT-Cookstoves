import React, { useState } from "react";
import {Divider, Row, Typography} from "antd";

const { Text } = Typography;

export default function NFTDisplay(props) {
  function projectStatusDisplay(status) {
    switch (status) {
      case 0:
        return <h3>Created</h3>
      case 1:
        return <h3 style={{color: 'orange'}}>Pending</h3>
      case 2:
        return <h3 style={{color: 'green'}}>Approved</h3>
      case 3:
        return <h3 style={{color: 'red'}}>Rejected</h3>
    }
  }

  return (
    <div style={{border: "1px solid #cccccc", padding: 16, margin: "auto", marginTop: 32}}>
      <div style={{margin: 8}}>
        <Row>
          <h2>Token Data</h2>
        </Row>
        <Row>
          <h4>Token ID: {props.tokenID}</h4>
        </Row>
        <Row>
          <h4>Methodology: {props.tokenData.methodology}</h4>
        </Row>
        <Row>
          <h4>Project Developer: {props.tokenData.projectDeveloper}</h4>
        </Row>
        <Row>
          <h4>Verifier: {props.tokenData.verifier}</h4>
        </Row>
        <Row>
          <h4>Number of Tonnes: {props.tokenData.quantity.toNumber()} tCO2e</h4>
        </Row>
        <Row>
          <h4>Data Link: {props.tokenData.dataLink}</h4>
        </Row>
        <Row>
          <h4>Vintage: {props.tokenData.vintage.toNumber()}</h4>
        </Row>
        <Row>
          <h4>Vintage Start: {props.tokenData.vintageStart.toNumber()}</h4>
        </Row>
        <Row>
          <h4>Vintage End: {props.tokenData.vintageEnd.toNumber()}</h4>
        </Row>
        <Row>
          <h4>Verifier Signature:
            <Text copyable={{text: props.tokenData.verifierSignature}}>
              <a
                target="_blank"
                rel="noopener noreferrer"
              >
                {props.tokenData.verifierSignature.slice(0, 10) + '...'}
              </a>
            </Text>
          </h4>
        </Row>
        <Divider/>
        <Row align='center'>
          {projectStatusDisplay(props.tokenData.status)}
        </Row>
      </div>
    </div>
  )
}
