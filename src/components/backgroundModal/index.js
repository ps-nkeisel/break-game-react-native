import Modal from '@/components/modal/index';
import { BackButton } from '@/styles/style';

import { ModalTutorial } from './styles'
import React from 'react';



export default function backgroundModal(props) {

    const { visibility, onBackPressed, children } = props;


    return (
        <Modal visibility={visibility}>
            <ModalTutorial>
                <BackButton style={{ position: "absolute", top: "-70px", left: "44%" }} onClick={onBackPressed} />
                {children}
                <div className="background"></div>
            </ModalTutorial>
        </Modal>
    )
}