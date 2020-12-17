import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import {
  BoxMetal, EngineRotate, ListOptions, ItemList,
} from '../../../../styles/style';


class BodyContent extends Component {
  componentDidMount() {}

  render() {
    return (
      <>

        <BoxMetal>
          <EngineRotate />
          <ListOptions>
            <ItemList>
              <Link to="/locations">Play</Link>
            </ItemList>
            <ItemList>
              <Link to="/gear">Gear</Link>
            </ItemList>
          </ListOptions>
          {/* <SeasonButton /> */}
        </BoxMetal>

      </>
    );
  }
}

export default BodyContent;
