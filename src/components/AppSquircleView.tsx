import React from 'react';
import FastSquircleView, { FastSquircleViewProps } from 'react-native-fast-squircle';

const AppSquircleView = ({ children, ...props }: FastSquircleViewProps) => {
  return (
    <FastSquircleView
      cornerSmoothing={1} // 0-1
      {...props}>
      {children}
    </FastSquircleView>
  );
};

export default AppSquircleView;
