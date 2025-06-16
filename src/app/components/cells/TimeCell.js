'use client';

import React from "react";

const TimeCell = (props) => {
  return (
    <td>
      {props.dataItem[props.field]}
    </td>
  );
};

export default TimeCell;