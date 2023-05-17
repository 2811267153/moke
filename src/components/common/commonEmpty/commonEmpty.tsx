import { Empty } from 'antd';
import React from 'react';

interface PropsType {
  description: string
}
export const CommonEmpty: React.FC<PropsType> = ({description}) => {
  return (
    <Empty
      description={description}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  )
}