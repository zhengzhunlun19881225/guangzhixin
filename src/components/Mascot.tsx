import React from 'react';
import { figmaAssets } from '../data/figmaAssets';
export const Mascot: React.FC<{size?: number; sleeping?: boolean; className?: string}> = ({size=32,sleeping=false,className=''}) => (
  <img src={figmaAssets[sleeping ? '71-5347:img' : '71-6303:img4']} alt="广智新助手" className={className} style={{width:size,height:size,objectFit:'contain',flexShrink:0}} />
);
