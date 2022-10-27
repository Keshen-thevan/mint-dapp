//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Mint is ERC20{

    uint256 tokenPrice = 0.001 ether;
    address payable owner;
    mapping(address => uint256) tokensOwned;
    event Minted(address indexed _from, uint _value);

    modifier onlyOwner(){
        require(msg.sender == owner, "function access restricted to the owner");
        _;
    }
    
    constructor() ERC20("Woolongs", "W"){
        _mint(msg.sender, 10 * 10**18);
        owner == msg.sender;
    }

    function mint(uint256 _amount)external payable{
        require(msg.value >= _amount * tokenPrice, "Ether sent is incorrect");
        tokensOwned[msg.sender] += _amount;
        _mint(msg.sender, _amount * 10 **18);
        emit Minted(msg.sender, _amount);
    }

    function withdraw() external onlyOwner{
        uint256 _amount = address(this).balance;
        (bool sent,) = owner.call{value: _amount}("");
        require(sent, "Failed to withdraw Ether");
    }

    function getBalance() external view returns(uint256){
        return address(this).balance;
    }

    receive() external payable{}
    fallback () external payable{}
}

//Mint contract address:  0x55E812864624B4e3571C65373E79d6f557Dcf449