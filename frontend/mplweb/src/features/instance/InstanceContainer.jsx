import React from "react";
import { useParams } from "react-router-dom";
export default function InstanceContainer(props) {
  const { id } = useParams();
  return <div>InstanceContainer for instance {id}</div>;
}
