import React, { useState, useEffect, useRef } from 'react'
import Web3 from 'web3'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './contracts/StockOracle'
import logo from './logo.svg'
import './App.css'

function App() {
  const provider = useRef(new Web3('http://localhost:8545'))
  const [account, setAccount] = useState()
  const [contractInstance, setContractInstance] = useState()
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [symbol, setSymbol] = useState('')
  const [price, setPrice] = useState('0')
  const [volume, setVolume] = useState('0')

  useEffect(() => {
    provider.current.eth.getAccounts().then(accounts => {
      setAccount(accounts[0])
    })
  }, [])

  useEffect(() => {
    if (account && provider) {
      const contract = new provider.current.eth.Contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS,
      )
      setContractInstance(contract)
      setLoading(false)
    }
  }, [account])

  useEffect(() => {
    fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=0AITTRXSIM05GRPW`,
    )
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setData(data['Global Quote'])
      })
      .catch(err => {
        console.log(err)
        setPrice('0')
        setVolume('0')
      })
  }, [symbol])

  const send = async () => {
    const setStockTx = await contractInstance.methods
      .setStock(
        Web3.utils.fromUtf8(data['01. symbol']),
        Number(data['05. price']) * 100,
        Number(data['06. volume']),
      )
      .send({ from: account })
  }

  const getPrice = async () => {
    const currentPrice = await contractInstance.methods
      .getStockPrice(Web3.utils.fromUtf8(symbol))
      .call()
    setPrice((currentPrice/100).toString())
  }
  const getVolume = async () => {
    const currentVolume = await contractInstance.methods
      .getStockVolume(Web3.utils.fromUtf8(symbol))
      .call()
    setVolume(currentVolume.toString())
  }

  return (
    <div className="App">
      {loading && (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      )}
      {!loading && (
        <div>
          <div> Search for a ticker symbol
            <input onChange={e => setSymbol(e.target.value.toUpperCase())} value={symbol} />
          </div>
          {data && (
            <>
              <div>
                <button onClick={send}>
                  Click to send price data to smart contract
                </button>
              </div>
              <div>
                <button onClick={getPrice}>Click to get price</button>
              </div>
              <div>
                <button onClick={getVolume}>Click to get volume</button>
              </div>
              <div>
                <div>price: {price}</div>
                <div>volume: {volume}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default App
