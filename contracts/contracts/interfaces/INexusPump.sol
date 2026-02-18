// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface INexusPumpToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function creator() external view returns (address);
    function graduated() external view returns (bool);
    function setGraduated() external;
}

interface ITokenFactory {
    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        string description;
        string imageUrl;
        string website;
        string twitter;
        string telegram;
        address creator;
        uint256 createdAt;
        uint256 totalRaised;
        bool graduated;
    }

    struct Comment {
        address author;
        string message;
        uint256 timestamp;
    }

    function createToken(
        string memory name,
        string memory symbol,
        string memory description,
        string memory imageUrl,
        string memory website,
        string memory twitter,
        string memory telegram
    ) external returns (address);

    function buy(address tokenAddress) external payable;
    function sell(address tokenAddress, uint256 amount) external;
    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory);
    function getAllTokens(uint256 offset, uint256 limit) external view returns (TokenInfo[] memory);
    function getTokenCount() external view returns (uint256);
}

interface INexusPumpDEX {
    function addLiquidity(address tokenAddress) external payable;
    function swapNEXForTokens(address tokenAddress) external payable;
    function swapTokensForNEX(address tokenAddress, uint256 amount) external;
    function getReserves(address tokenAddress) external view returns (uint256 nexReserve, uint256 tokenReserve);
}
