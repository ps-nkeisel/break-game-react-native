import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export default function CustomScrollBar(props) {
  const { children } = props;

  return (
    <Scrollbars
      style={{ width: '100%', height: "85%"  }}
      universal
      renderTrackHorizontal={(props) => <div {...props} className="track-horizontal" />}
      renderTrackVertical={(props) => <div {...props} className="track-vertical" />}
      renderThumbHorizontal={(props) => <div {...props} className="thumb-horizontal" />}
      renderThumbVertical={(props) => <div {...props} className="thumb-vertical" />}
      renderView={(props) => <div {...props} className="view" />}
    >
      {children}
    </Scrollbars>
  );
}
