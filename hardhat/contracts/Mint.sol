//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Mint is ERC20, Ownable{

    uint256 tokenPrice = 0.001 ether;
    mapping(address => uint256) tokensOwned;
    event Minted(address indexed _from, uint _value);
    
    constructor() ERC20("Woolongs", "W"){
        _mint(msg.sender, 10 * 10**18);
    }

    function mint(uint256 _amount)external payable{
        require(msg.value >= _amount * tokenPrice, "Ether sent is incorrect");
        tokensOwned[msg.sender] += _amount;
        _mint(msg.sender, _amount * 10 **18);
        emit Minted(msg.sender, _amount);
    }

    function withdraw() external onlyOwner{
        uint256 _amount = address(this).balance;
        (bool sent,) = owner().call{value: _amount}("");
        require(sent, "Failed to withdraw Ether");
    }

    function getBalance() external view returns(uint256){
        return address(this).balance;
    }


    receive() external payable{}
    fallback () external payable{}
}

//Mint contract address:   0x8021D12A34EE66d9CaABa105c69377F3310b0867