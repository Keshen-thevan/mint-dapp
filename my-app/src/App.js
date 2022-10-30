
import './App.css';
import Web3Modal from 'web3modal'
import ethers, { providers, Contract, utils } from "ethers"
import { useRef, useEffect, useState } from "react"
import {ADDRESS, ABI} from './constants'


function App() {
  const web3ModalRef = useRef();
  const [walletConnected, setWalletConnected]  = useState(false)
  const [userAddress, setUserAddress] = useState('')
  const [totalSupply, setTotalSupply] = useState('')
  const [tokensOwned, setTokensOwned] = useState('')
  const [contractBalance, setContractBalance] = useState('')
  const [owner, setOwner] = useState('')
  const [balance, setBalance] = useState('')
  const tokenPrice = 0.001;

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
  }, [walletConnected, totalSupply])

  useEffect(() =>{
    getTotalSupply()
    getAmountOwned()
    getBalance()
    getOwner()
    getContractBalance()
  }, [totalSupply,tokensOwned,contractBalance])

  const getUserAddress = async() => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    const account = accounts[0]
    setUserAddress(account)
  }

  const mint = async() =>{
    const inputAmount = document.getElementById('amountInput').value
    const signer = await getProviderOrSigner(true)
    const mintContract = new Contract(ADDRESS, ABI, signer);
    const value = inputAmount * tokenPrice
    const tx = await mintContract.mint(inputAmount, {value: utils.parseEther(value.toString())});
    await tx.wait()
    window.alert("Successfully minted " + inputAmount + " Woolongs")
    document.getElementById('amountInput').value = ''
  }

  const getTotalSupply = async() =>{
    const provider = await getProviderOrSigner();
    const mintContract = new Contract(ADDRESS, ABI, provider)
    const tx = await mintContract.totalSupply()
    const supply = tx / 10 ** 18
    setTotalSupply(supply.toLocaleString())
  }

  const getAmountOwned = async() =>{
    const provider = await getProviderOrSigner()
    const mintContract = new Contract(ADDRESS, ABI, provider)
    const tx = await mintContract.balanceOf(userAddress)
    const owned = tx / 10 ** 18
    setTokensOwned(owned.toLocaleString())
  }

  const withdraw = async() =>{
    const signer = await getProviderOrSigner(true)
    const mintContract = new Contract(ADDRESS, ABI, signer);
    const tx = await mintContract.withdraw();
    await tx.wait()
    window.alert('All funds have been withdrawn')
  }

  const getContractBalance = async() =>{
    const provider = await getProviderOrSigner()
    const mintContract = new Contract(ADDRESS, ABI, provider)
    const tx = await mintContract.getBalance()
    setContractBalance(utils.formatEther(tx))
  }

  const getBalance = async() =>{
    const provider = await getProviderOrSigner()
    const balance = await provider.getBalance(userAddress)
    const finalBalance = parseFloat(utils.formatEther(balance)).toFixed(2);
    setBalance(finalBalance)

  }

  const getOwner = async() =>{
    const provider = await getProviderOrSigner()
    const mintContract = new Contract(ADDRESS, ABI, provider)
    const tx = await mintContract.owner()
    setOwner(tx)
  }

  const renderBody = ()=> {
    if(userAddress !== owner.toLowerCase()){
      return(
        <div className='description'>Woolong is the standard currency of the solar system. Made popular by the famous anime
        Cowboy Bebop. It is a quick and efficient way to everyday transactions. If you plan on traveling the galaxy, then go ahead and mint yourself a few woolongs. It is accepted 
        by over all merchants in the star system. 
      </div>)
    }else{
      return(<div>
        <div>Contract Balance: {contractBalance} ETH</div>
        <button className='btn' onClick={withdraw}>Withdraw</button>
        </div>)
    }
  }


  return (
    <div className="App">
      <div className="userInfo">

        <img src='user.png' className="userImg" alt="userIcon"/>
        <div className='userData'>
          <div className="userTitle">User:</div>
          <div>{userAddress}</div>
        </div>
        <div className="userData">
          <div className="userTitle">Balance:</div>
          <div>{balance} Eth</div>
        </div>

      </div>
      <div className="heading"> &#xFFE6;oolong </div>
      
      <div className='priceText'>Current woolong price is only 0.001 Eth</div>

      {renderBody()}
      <div className='coinDescription'>
        <div className='coinInfo'>Current total supply:{totalSupply} &#xFFE6; </div>
        <div>Total Owned coins: {tokensOwned} &#xFFE6;</div>
      </div>
      <div className="container">
        <label htmlFor = "amountInput">Amount To Mint:</label>
        <input type="number" className="amountInput" id="amountInput"/>
        <button className='btn' onClick={mint}>Mint</button>
      </div>
    </div>
  );
}

export default App;
