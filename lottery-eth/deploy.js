const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

// HDWalletProvider를 활용해서 provider를 직접 만든다

const provider = new HDWalletProvider(
  'voyage slam leave gasp mansion armor ivory size throw visa blast weasel',
  'https://rinkeby.infura.io/1n7ngBVFQi37NC1sj4Rj '
);

const web3 = new Web3(provider);

// async 함수 쓰려고 deploy 함수 억지로 만듬 이렇게 해야 async 사용 가능
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log(interface);
  console.log('Contract deployed to', result.options.address)
};
deploy();
