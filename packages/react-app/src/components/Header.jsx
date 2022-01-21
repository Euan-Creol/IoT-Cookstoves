import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
      <PageHeader
        title="Prototype Verifier App"
        subTitle="Allows a trusted third party to upload and verify stove data"
        style={{ cursor: "pointer" }}
      />
  );
}
