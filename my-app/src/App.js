
import './App.css';
import Web3Modal from 'web3modal'
import { providers, Contract, utils } from "ethers"
import { useRef, useEffect, useState } from "react"


function App() {
  const web3ModalRef = useRef();
  const [walletConnected, setWalletConnected]  = useState(false)
  const [userAddress, setUserAddress] = useState('')

  const connectWallet = async() =>{
    try{
      await getProviderOrSigner()
      setWalletConnected(true) 
      getUserAddress()
    }catch(err){console.error(err)}
  }

  const getProviderOrSigner = async(needSigner = false) =>{
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();

    if(chainId !== 80001){
      window.alert("Change network to Mumbai.")
      throw new Error("Change network to Mumbai.");
    }

    if(needSigner){
      const signer = web3Provider.getSigner()
      return signer
    }
    return web3Provider

  }

  useEffect(() =>{
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      })
      
      connectWallet()
    }
  }, [walletConnected])

  const getUserAddress = async() => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    const account = accounts[0]
    setUserAddress(account)
  }


  return (
    <div className="App">
      <div className="userInfo">

        <img src='user.png' className="userImg"/>
        <div className='userData'>
          <div className="userTitle">User:</div>
          <div>{userAddress}</div>
        </div>
        <div className="userData">
          <div className="userTitle">Balance:</div>
          <div>354543434 Eth</div>
        </div>

      </div>
      <div className="heading"> &#xFFE6; Woolongs </div>
      <div className='description'>woolongs is the standard currency of the solar system. Made popular by the famous anime Cowboy Bebop.
        If you plan on traveling the galaxy, then go ahead and mint yourself a few woolongs. It is accepted by over
        90% of merchants in the star system.  
      </div>
      <div>current woolong price is only 0.001 Eth</div>
    </div>
  );
}

export default App;
