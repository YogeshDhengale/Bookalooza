import React from 'react'

const Twitter = ({color, fill, stroke}: {color?: string, fill?: string,  stroke?: string}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width="23" height="23">
  <g fill={color} fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: "normal" } as React.CSSProperties}>
    <g transform="scale(5.12,5.12)">
      <path d="M11,4c-3.866,0 -7,3.134 -7,7v28c0,3.866 3.134,7 7,7h28c3.866,0 7,-3.134 7,-7v-28c0,-3.866 -3.134,-7 -7,-7zM13.08594,13h7.9375l5.63672,8.00977l6.83984,-8.00977h2.5l-8.21094,9.61328l10.125,14.38672h-7.93555l-6.54102,-9.29297l-7.9375,9.29297h-2.5l9.30859,-10.89648zM16.91406,15l14.10742,20h3.06445l-14.10742,-20z"/>
    </g>
  </g>
</svg>
  )
}

export default Twitter