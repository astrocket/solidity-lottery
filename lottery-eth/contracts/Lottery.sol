pragma solidity ^0.4.17;

contract Lottery {
    // Anyone can access manager variable;
    address public manager;
    address[] public players;
    //address public lastWinner; 형태로 승자 저장해서 뽑아오기 가능

    // Construct function that has same name as contract
    function Lottery() public {
        // Global Variable. Always available in function
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        // sha3 is a Global function
        // sha3() and keccak256() are same niche
        // uint() function will translate given input to uint.
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        // this.balance로 가져오는 컨트랙의 balance 는 BigNumber.js instance임 숫자가 아님.
        players[index].transfer(this.balance); // returns address (object)
        //lastWinner = players[index]; 형태로 승자 저장해서 뽑아오기 가능
        players = new address[](0); // dynamic array with intially 0 seats.
    }

    modifier restricted() {
        require(msg.sender == manager);
        // modifier 로 선언 된 메서드는 _; 안에 들어가게 된다. modifier가 일종의 껍데기 같은거임.
        _;
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

}
