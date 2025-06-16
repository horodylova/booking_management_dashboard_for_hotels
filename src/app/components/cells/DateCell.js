'use client';

import React from "react";

const DateCell = (props) => {
  return (
    <td>
      {props.dataItem[props.field]}
    </td>
  );
};

export default DateCell;