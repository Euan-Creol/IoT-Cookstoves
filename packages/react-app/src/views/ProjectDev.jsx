import React from "react";
import { Link } from "react-router-dom";
import {Card, Col, Row} from "antd";
import projectDevImage from "../projectDevImage.jpg";
import verifierImage from "../verifierImage.jpg";
import ImageButton from "../components/ImageButton";

export default function ProjectDev({
                               }) {
  return (
    <div>
      <h1>Project Developer</h1>
      <ImageButton
        title="Submit Claim"
        description="Upload data to create a new carbon claim"
        image={projectDevImage}
        link='/upload'
        imageAlign="right"
      />
      <ImageButton
        title="Manage"
        description="Choose what to do with your approved tons"
        image={verifierImage}
        link='/actions'
        imageAlign="left"
      />
    </div>
  )
}
