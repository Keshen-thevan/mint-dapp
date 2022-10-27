//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Mint is ERC20{

    uint256 tokenPrice = 0.001 ether;
    address payable owner;
    mapping(address => uint256) tokensOwned;
    event Minted(address indexed _from, uint _value);

    modifier onlyOwner(){
        require(msg.sender = owner, "function access restricted to the owner");
        _;
    }
    

    constructor() ERC20("Woolongs", "W"){
        _mint(msg.sender, 10 * 10**18);
        owner = payable(msg.sender);
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

         function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
      }

    
}