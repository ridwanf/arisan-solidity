// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address[] public players;
    string[] private namePlayers;

    constructor() {
        manager = msg.sender;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only Manager can run it");
        _;
    }

    function enter(string memory _name) public payable {
        require(msg.value > .01 ether, "");
        players.push(msg.sender);
        namePlayers.push(_name);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public onlyManager {
        require(players.length > 0, "Please add the player first");
        uint256 index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        clearData();
    }

    function getPlayers() public view returns (string[] memory) {
        return namePlayers;
    }

    function clearData() private {
        delete players;
        delete namePlayers;
    }
}
