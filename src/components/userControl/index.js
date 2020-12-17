import React, {useEffect} from 'react';

import GameService from '@/stages/game/scripts/core/services/GameService'
import { ContainerControl, ContainerCounter, ProgressBox, ContainerAvatar } from './styles';

import VolumeControl from '../../components/volumeControl/index';

import { connect } from 'react-redux';
export function getPercentageToNextLevel() {
    var xpNeeded = GameService.getXpNeededNextLevel();
    var currentXp = GameService.getCurrentExperience();
    return (currentXp/xpNeeded) * 100;
}

const UserFooterComponent = function UserControl(props) {

    const user = props.user;

    useEffect(() => {
        // console.log("percentage to next level", getPercentageToNextLevel())
    }, []);

    return (
        <React.Fragment>
            <ContainerControl>
                <div className="box">
                    <ContainerCounter>
                        <h2 className="counter">{user.level}</h2>
                        <ProgressBox porcentage={getPercentageToNextLevel()}>
                            <div className="line"></div>
                        </ProgressBox>
                    </ContainerCounter>
                    <ContainerAvatar>
                        <img alt="Your profile" className="avatar"
                            src={user.avatar ? user.avatar : 'images/ui/mainmenu/temporal_profile_image.png'} />
                    </ContainerAvatar>
                    <h2 className="name">{user.name}</h2>
                </div>

                <VolumeControl></VolumeControl>
            </ContainerControl>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    user: state.user,
});


export default connect(mapStateToProps)(UserFooterComponent)