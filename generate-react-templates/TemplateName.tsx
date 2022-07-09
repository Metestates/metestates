import React, { FC } from 'react';

import styles from './TemplateName.css';

type TemplateNameProps = React.PropsWithChildren<{}>

const TemplateName: FC<TemplateNameProps> = () => {

  return (
    <div className="TemplateName" data-testid="TemplateName">
      TemplateName
	  </div>
  )

}

export default TemplateName;
