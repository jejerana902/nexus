// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NexusPumpDEX
 * @dev Simple AMM DEX for graduated tokens using constant product formula (x * y = k)
 */
contract NexusPumpDEX is ReentrancyGuard {
    // Token address => NEX reserve
    mapping(address => uint256) public nexReserves;
    
    // Token address => Token reserve
    mapping(address => uint256) public tokenReserves;
    
    // Fee: 0.3% = 3/1000
    uint256 private constant FEE_NUMERATOR = 3;
    uint256 private constant FEE_DENOMINATOR = 1000;
    
    event LiquidityAdded(address indexed token, uint256 nexAmount, uint256 tokenAmount);
    event Swap(address indexed token, address indexed trader, bool nexToToken, uint256 amountIn, uint256 amountOut);
    
    /**
     * @dev Add liquidity for a token (called by factory on graduation)
     * @param tokenAddress Token address
     */
    function addLiquidity(address tokenAddress) external payable nonReentrant {
        require(msg.value > 0, "Must send NEX");
        require(tokenAddress != address(0), "Invalid token");
        
        // Get token balance sent to this contract
        IERC20 token = IERC20(tokenAddress);
        uint256 tokenAmount = token.balanceOf(address(this));
        require(tokenAmount > 0, "Must have token balance");
        
        // Initialize reserves
        nexReserves[tokenAddress] += msg.value;
        tokenReserves[tokenAddress] += tokenAmount;
        
        emit LiquidityAdded(tokenAddress, msg.value, tokenAmount);
    }
    
    /**
     * @dev Swap NEX for tokens
     * @param tokenAddress Token to buy
     */
    function swapNEXForTokens(address tokenAddress) external payable nonReentrant {
        require(msg.value > 0, "Must send NEX");
        require(nexReserves[tokenAddress] > 0, "No liquidity");
        
        uint256 nexReserve = nexReserves[tokenAddress];
        uint256 tokenReserve = tokenReserves[tokenAddress];
        
        // Calculate amount out with fee
        // amountOut = (amountIn * 997 * tokenReserve) / (nexReserve * 1000 + amountIn * 997)
        uint256 nexAmountWithFee = msg.value * (FEE_DENOMINATOR - FEE_NUMERATOR);
        uint256 numerator = nexAmountWithFee * tokenReserve;
        uint256 denominator = (nexReserve * FEE_DENOMINATOR) + nexAmountWithFee;
        uint256 tokensOut = numerator / denominator;
        
        require(tokensOut > 0, "Insufficient output");
        require(tokensOut < tokenReserve, "Insufficient liquidity");
        
        // Update reserves
        nexReserves[tokenAddress] += msg.value;
        tokenReserves[tokenAddress] -= tokensOut;
        
        // Transfer tokens
        IERC20(tokenAddress).transfer(msg.sender, tokensOut);
        
        emit Swap(tokenAddress, msg.sender, true, msg.value, tokensOut);
    }
    
    /**
     * @dev Swap tokens for NEX
     * @param tokenAddress Token to sell
     * @param amount Token amount to sell
     */
    function swapTokensForNEX(address tokenAddress, uint256 amount) external nonReentrant {
        require(amount > 0, "Must sell tokens");
        require(nexReserves[tokenAddress] > 0, "No liquidity");
        
        uint256 nexReserve = nexReserves[tokenAddress];
        uint256 tokenReserve = tokenReserves[tokenAddress];
        
        // Transfer tokens from user
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        
        // Calculate NEX out with fee
        uint256 tokenAmountWithFee = amount * (FEE_DENOMINATOR - FEE_NUMERATOR);
        uint256 numerator = tokenAmountWithFee * nexReserve;
        uint256 denominator = (tokenReserve * FEE_DENOMINATOR) + tokenAmountWithFee;
        uint256 nexOut = numerator / denominator;
        
        require(nexOut > 0, "Insufficient output");
        require(nexOut < nexReserve, "Insufficient liquidity");
        
        // Update reserves
        tokenReserves[tokenAddress] += amount;
        nexReserves[tokenAddress] -= nexOut;
        
        // Transfer NEX
        payable(msg.sender).transfer(nexOut);
        
        emit Swap(tokenAddress, msg.sender, false, amount, nexOut);
    }
    
    /**
     * @dev Get reserves for a token
     * @param tokenAddress Token address
     * @return nexReserve NEX reserve
     * @return tokenReserve Token reserve
     */
    function getReserves(address tokenAddress) external view returns (uint256 nexReserve, uint256 tokenReserve) {
        return (nexReserves[tokenAddress], tokenReserves[tokenAddress]);
    }
}
