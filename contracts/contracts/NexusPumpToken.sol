// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NexusPumpToken
 * @dev ERC20 token with bonding curve minting/burning
 * Only the factory (owner) can mint/burn tokens
 */
contract NexusPumpToken is ERC20, Ownable {
    // Token metadata
    string public description;
    string public imageUrl;
    string public website;
    string public twitter;
    string public telegram;
    
    // Token info
    address public creator;
    uint256 public createdAt;
    uint256 public totalRaised;
    bool public graduated;
    
    /**
     * @dev Constructor
     * @param _name Token name
     * @param _symbol Token symbol
     * @param _description Token description
     * @param _imageUrl Token image URL
     * @param _website Website URL
     * @param _twitter Twitter handle
     * @param _telegram Telegram link
     * @param _creator Address of the token creator
     * @param _factory Address of the factory (will be owner)
     */
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _description,
        string memory _imageUrl,
        string memory _website,
        string memory _twitter,
        string memory _telegram,
        address _creator,
        address _factory
    ) ERC20(_name, _symbol) Ownable(_factory) {
        description = _description;
        imageUrl = _imageUrl;
        website = _website;
        twitter = _twitter;
        telegram = _telegram;
        creator = _creator;
        createdAt = block.timestamp;
        totalRaised = 0;
        graduated = false;
    }
    
    /**
     * @dev Mint tokens (only factory)
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens (only factory)
     * @param from Address to burn from
     * @param amount Amount to burn
     */
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
    
    /**
     * @dev Add to total raised amount (only factory)
     * @param amount Amount to add
     */
    function addRaised(uint256 amount) external onlyOwner {
        totalRaised += amount;
    }
    
    /**
     * @dev Mark token as graduated (only factory)
     */
    function setGraduated() external onlyOwner {
        graduated = true;
    }
}
