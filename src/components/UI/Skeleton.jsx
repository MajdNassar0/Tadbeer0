import React from "react";

const Skeleton = ({ className = "" }) => (
  <div className={`rounded-lg animate-pulse bg-gray-200 ${className}`}/>
);

export default Skeleton;