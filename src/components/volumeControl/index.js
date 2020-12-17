import React from 'react';
import { ButtonVolume } from './styles';
import { connect } from 'react-redux';
import { Dispatchers } from '@/store/ducks/app';

const changeStateMute = (event, stateMuted) => {
  event.stopPropagation();
  event.preventDefault();
  Dispatchers.changeStatsMute(stateMuted);
};

function VolumeControl({ mutedStatus }) {

  return (
    <>
      <ButtonVolume
        onClick={(e) => changeStateMute(e, !mutedStatus)}
        active={!mutedStatus}
      />
    </>
  );
}

const mapStateToProps = state => ({
  mutedStatus: state.app.muted
});  

export default connect(mapStateToProps)(VolumeControl);