// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract Arisan {

    struct PlayerData {
        string name;
        address playerAddress;
        uint256 balance;
    }
    address public manager;
    address[] public players;
    PlayerData[] private winnerList;
    PlayerData[] private listPlayers;
    constructor() {
        manager = msg.sender;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only Manager can run it");
        _;
    }

    function enter(string memory _name) public payable {
        require(msg.value > .01 ether, "");
        PlayerData memory data = PlayerData(_name, msg.sender, msg.value);
        players.push(msg.sender);
        listPlayers.push(data);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public onlyManager returns (PlayerData memory){
        require(players.length > 0, "Please add the player first");
        uint256 index = random() % players.length;
        PlayerData memory winner = PlayerData(listPlayers[index].name, listPlayers[index].playerAddress, address(this).balance);
        payable(players[index]).transfer(address(this).balance);
        winnerList.push(winner);
        clearData();
        return winner;
    }

    function getPlayers() public view returns (PlayerData[] memory) {
        return listPlayers;
    }

     function getWinnerList() public view returns (PlayerData[] memory) {
        return winnerList;
    }

    function clearData() private {
        delete players;
        delete listPlayers;
    }

    function clearWinner() public onlyManager {
        delete winnerList;
    }
}
