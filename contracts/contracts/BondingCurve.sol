// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BondingCurve
 * @dev Library for exponential bonding curve calculations
 * Formula: price = BASE_PRICE * e^(k * supply)
 * Uses fixed-point math to approximate exponential function
 */
library BondingCurve {
    uint256 private constant PRECISION = 1e18;
    uint256 private constant BASE_PRICE = 1e12; // 0.000001 NEX in wei (1e18 wei = 1 NEX)
    
    /**
     * @dev Calculate the steepness parameter k based on target market cap
     * For a target of 69 NEX at 1 billion tokens: k = ln(69 / BASE_PRICE) / 1e9
     * We use k = 1e8 for a reasonable curve
     */
    uint256 private constant K = 1e8; // Curve steepness parameter
    
    /**
     * @dev Calculate how many tokens to mint for a given NEX amount
     * Uses numerical integration of the bonding curve
     * @param currentSupply Current token supply
     * @param nexAmount Amount of NEX being spent
     * @return tokensToMint Number of tokens to mint
     */
    function calculatePurchaseReturn(
        uint256 currentSupply,
        uint256 nexAmount
    ) internal pure returns (uint256 tokensToMint) {
        if (nexAmount == 0) return 0;
        
        // Simplified calculation using average price over the range
        // avgPrice = (priceAtStart + priceAtEnd) / 2
        uint256 priceAtStart = getPrice(currentSupply);
        
        // Estimate end supply using linear approximation
        uint256 estimatedTokens = (nexAmount * PRECISION) / priceAtStart;
        uint256 priceAtEnd = getPrice(currentSupply + estimatedTokens);
        
        // Use average price for more accurate calculation
        uint256 avgPrice = (priceAtStart + priceAtEnd) / 2;
        tokensToMint = (nexAmount * PRECISION) / avgPrice;
        
        return tokensToMint;
    }
    
    /**
     * @dev Calculate how much NEX to return for selling tokens
     * Uses numerical integration of the bonding curve
     * @param currentSupply Current token supply
     * @param tokensToSell Number of tokens being sold
     * @return nexToReturn Amount of NEX to return
     */
    function calculateSaleReturn(
        uint256 currentSupply,
        uint256 tokensToSell
    ) internal pure returns (uint256 nexToReturn) {
        if (tokensToSell == 0 || tokensToSell > currentSupply) return 0;
        
        // Calculate average price over the range
        uint256 priceAtStart = getPrice(currentSupply);
        uint256 priceAtEnd = getPrice(currentSupply - tokensToSell);
        
        uint256 avgPrice = (priceAtStart + priceAtEnd) / 2;
        nexToReturn = (tokensToSell * avgPrice) / PRECISION;
        
        return nexToReturn;
    }
    
    /**
     * @dev Get current price for the next token
     * price = BASE_PRICE * e^(k * supply)
     * We approximate e^x using Taylor series: e^x ≈ 1 + x + x^2/2 + x^3/6 + ...
     * @param supply Current supply
     * @return price Current price in wei
     */
    function getPrice(uint256 supply) internal pure returns (uint256 price) {
        // Calculate exponent: k * supply / PRECISION
        uint256 exponent = (K * supply) / PRECISION;
        
        // Approximate e^x using first few terms of Taylor series
        // For small x: e^x ≈ 1 + x + x^2/2 + x^3/6
        uint256 exp = PRECISION; // Start with 1
        uint256 term = exponent;
        
        // Add x
        exp += term;
        
        // Add x^2/2
        term = (term * exponent) / PRECISION / 2;
        exp += term;
        
        // Add x^3/6
        term = (term * exponent) / PRECISION / 3;
        exp += term;
        
        // Add x^4/24
        term = (term * exponent) / PRECISION / 4;
        exp += term;
        
        // price = BASE_PRICE * e^(k * supply)
        price = (BASE_PRICE * exp) / PRECISION;
        
        return price;
    }
    
    /**
     * @dev Calculate market cap at given supply
     * Market cap is the integral of the bonding curve
     * @param supply Token supply
     * @return marketCap Total NEX value
     */
    function getMarketCap(uint256 supply) internal pure returns (uint256 marketCap) {
        if (supply == 0) return 0;
        
        // Approximate market cap using average price * supply
        uint256 avgPrice = getPrice(supply / 2);
        marketCap = (supply * avgPrice) / PRECISION;
        
        return marketCap;
    }
}
