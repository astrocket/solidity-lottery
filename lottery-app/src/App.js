import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  // constructor정의 이렇게 하는걸로 es6가 변경 됨.
  state = {
    manager: '',
    players: [],
    balance: '', // BigNumber.js라서 ''로 저장
    value: '', // text input은 항상 문자열이라서 '' 로 정의
    message: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    // 컨트랙의 이더 밸런스 가져오기, BigNumber.js 기반의 오브젝트임 나중에 다시 다룸
    this.setState({
      manager,
      players,
      balance,
    });
  }

  // 이렇게 해주면 binding을 컴포넌트에서 안해도 됨.
  // e stands for for submit submissions.
  onSubmit = async (e) => {
    // html의 기본 for submit을 막기 위해서 이거 처리 해줘야함.
    e.preventDefault();
    // we need to list accounts and specify one for send() method not like call()

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    // it will take about 15 seconds to succeed.
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered !' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}. <br/>
          There are currently {this.state.players.length} people entered. <br/>
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether !
        </p>
        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value} // enter value
              onChange={(e) => this.setState({ value: e.target.value })}
            />
          </div>
          <button type='submit'>Enter</button>
        </form>
        <hr/>
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner !</button>
        <hr/>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
