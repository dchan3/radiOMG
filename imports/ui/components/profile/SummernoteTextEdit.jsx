import React, { forwardRef } from 'react';

function SummernoteTextEdit(props, ref) {
  return <div {...{ ref }} id="summernote" />;
}

export default forwardRef(SummernoteTextEdit);
