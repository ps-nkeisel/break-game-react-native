import React from 'react';
import { withRouter } from 'react-router-dom';
import { BackButton } from '../../styles/style';


const GoBack = ({ history,onBackButtonClicked }) => {
  
  function defaultBackButton(){
    history.goBack()
  }

  return (<BackButton onClick={onBackButtonClicked ?? defaultBackButton } alt="Go back" />)
};

export default withRouter(GoBack);
