import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CountUp from 'react-countup';
import { CoinsBox } from '../../styles/style';
import IAPModal from '@/components/iapModal';
function CoinBoxComponent(props) {

  const { coins } = props;
  const [isBuyingCoins, setBuyingCoins] = useState(false);
  const [prevCoins, setPrevCoins] = useState(coins);
  const [isVisible, setVisibility] = useState(true);

  useEffect(() => {
    setPrevCoins(coins)
  }, [coins])


  // if (prevCoins < coins){
  //  let sound =  new Sounds("getCoins2",{rate: 1.45,volume: 0.7})
  //  sound.play();
  // }

  function goBack(){
    setBuyingCoins(false);
    setVisibility(false);
  }

  function openModal(){
    setVisibility(true);
    setBuyingCoins(true);
  }


  if(isBuyingCoins){
    return <IAPModal visibility={isVisible} onGoBack={goBack}/>
  }

  return (
    <CoinsBox>
      {
        prevCoins > coins ?
          coins
          :
          <CountUp start={prevCoins} end={coins} delay={0} duration={4.1} />

      }
      <button className="button-coin" onClick={() => openModal()}></button>
    </CoinsBox >
  )

}

const mapStateToProps = state => ({
  coins: state.user.coins,

})

export default connect(mapStateToProps)(React.memo(CoinBoxComponent))