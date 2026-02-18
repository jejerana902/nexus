// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NexusPumpToken.sol";
import "./NexusPumpDEX.sol";
import "./BondingCurve.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TokenFactory
 * @dev Factory contract for creating and trading tokens via bonding curve
 */
contract TokenFactory is ReentrancyGuard {
    using BondingCurve for uint256;
    
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
    
    // All created tokens
    address[] public tokens;
    mapping(address => bool) public isToken;
    
    // Token comments
    mapping(address => Comment[]) public tokenComments;
    
    // DEX contract
    NexusPumpDEX public dex;
    
    // Platform fee (1%)
    uint256 private constant FEE_PERCENT = 1;
    address public feeRecipient;
    
    // Graduation threshold: 69 NEX
    uint256 public constant GRADUATION_THRESHOLD = 69 ether;
    
    // Events
    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        address indexed creator,
        uint256 timestamp
    );
    
    event TokenTraded(
        address indexed tokenAddress,
        address indexed trader,
        bool isBuy,
        uint256 nexAmount,
        uint256 tokenAmount,
        uint256 timestamp
    );
    
    event TokenGraduated(
        address indexed tokenAddress,
        uint256 totalRaised,
        uint256 timestamp
    );
    
    event CommentAdded(
        address indexed tokenAddress,
        address indexed author,
        string message,
        uint256 timestamp
    );
    
    /**
     * @dev Constructor
     * @param _dex DEX contract address
     * @param _feeRecipient Fee recipient address
     */
    constructor(address _dex, address _feeRecipient) {
        require(_dex != address(0), "Invalid DEX address");
        require(_feeRecipient != address(0), "Invalid fee recipient");
        dex = NexusPumpDEX(_dex);
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Create a new token
     * @param name Token name
     * @param symbol Token symbol
     * @param description Token description
     * @param imageUrl Image URL
     * @param website Website URL
     * @param twitter Twitter handle
     * @param telegram Telegram link
     * @return tokenAddress Address of created token
     */
    function createToken(
        string memory name,
        string memory symbol,
        string memory description,
        string memory imageUrl,
        string memory website,
        string memory twitter,
        string memory telegram
    ) external returns (address tokenAddress) {
        require(bytes(name).length > 0, "Name required");
        require(bytes(symbol).length > 0, "Symbol required");
        
        // Deploy new token
        NexusPumpToken token = new NexusPumpToken(
            name,
            symbol,
            description,
            imageUrl,
            website,
            twitter,
            telegram,
            msg.sender,
            address(this)
        );
        
        tokenAddress = address(token);
        tokens.push(tokenAddress);
        isToken[tokenAddress] = true;
        
        emit TokenCreated(tokenAddress, name, symbol, msg.sender, block.timestamp);
        
        return tokenAddress;
    }
    
    /**
     * @dev Buy tokens with NEX
     * @param tokenAddress Token to buy
     */
    function buy(address tokenAddress) external payable nonReentrant {
        require(isToken[tokenAddress], "Invalid token");
        require(msg.value > 0, "Must send NEX");
        
        NexusPumpToken token = NexusPumpToken(tokenAddress);
        require(!token.graduated(), "Token graduated");
        
        // Calculate fee
        uint256 fee = (msg.value * FEE_PERCENT) / 100;
        uint256 nexAmount = msg.value - fee;
        
        // Calculate tokens to mint using bonding curve
        uint256 currentSupply = token.totalSupply();
        uint256 tokensToMint = BondingCurve.calculatePurchaseReturn(currentSupply, nexAmount);
        
        require(tokensToMint > 0, "Insufficient output");
        
        // Mint tokens to buyer
        token.mint(msg.sender, tokensToMint);
        
        // Update total raised
        token.addRaised(nexAmount);
        
        // Send fee to recipient
        if (fee > 0) {
            payable(feeRecipient).transfer(fee);
        }
        
        emit TokenTraded(tokenAddress, msg.sender, true, nexAmount, tokensToMint, block.timestamp);
        
        // Check if token should graduate
        if (token.totalRaised() >= GRADUATION_THRESHOLD && !token.graduated()) {
            _graduateToken(tokenAddress);
        }
    }
    
    /**
     * @dev Sell tokens for NEX
     * @param tokenAddress Token to sell
     * @param amount Amount of tokens to sell
     */
    function sell(address tokenAddress, uint256 amount) external nonReentrant {
        require(isToken[tokenAddress], "Invalid token");
        require(amount > 0, "Must sell tokens");
        
        NexusPumpToken token = NexusPumpToken(tokenAddress);
        require(!token.graduated(), "Token graduated");
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Calculate NEX to return using bonding curve
        uint256 currentSupply = token.totalSupply();
        uint256 nexToReturn = BondingCurve.calculateSaleReturn(currentSupply, amount);
        
        require(nexToReturn > 0, "Insufficient output");
        require(address(this).balance >= nexToReturn, "Insufficient contract balance");
        
        // Calculate fee
        uint256 fee = (nexToReturn * FEE_PERCENT) / 100;
        uint256 nexAmount = nexToReturn - fee;
        
        // Burn tokens
        token.burn(msg.sender, amount);
        
        // Send NEX to seller
        payable(msg.sender).transfer(nexAmount);
        
        // Send fee to recipient
        if (fee > 0) {
            payable(feeRecipient).transfer(fee);
        }
        
        emit TokenTraded(tokenAddress, msg.sender, false, nexAmount, amount, block.timestamp);
    }
    
    /**
     * @dev Graduate token to DEX
     * @param tokenAddress Token to graduate
     */
    function _graduateToken(address tokenAddress) private {
        NexusPumpToken token = NexusPumpToken(tokenAddress);
        
        // Mark as graduated
        token.setGraduated();
        
        // Use only the token's raised amount for liquidity (not entire contract balance)
        uint256 nexLiquidity = token.totalRaised();
        uint256 tokenSupply = token.totalSupply();
        
        // Mint additional tokens for DEX liquidity (50% of current supply)
        uint256 tokensForDEX = tokenSupply / 2;
        token.mint(address(this), tokensForDEX);
        
        // Approve DEX to spend tokens
        token.approve(address(dex), tokensForDEX);
        
        // Transfer tokens to DEX
        token.transfer(address(dex), tokensForDEX);
        
        // Add liquidity to DEX
        dex.addLiquidity{value: nexLiquidity}(tokenAddress);
        
        emit TokenGraduated(tokenAddress, token.totalRaised(), block.timestamp);
    }
    
    /**
     * @dev Add a comment to a token
     * @param tokenAddress Token address
     * @param message Comment message
     */
    function addComment(address tokenAddress, string memory message) external {
        require(isToken[tokenAddress], "Invalid token");
        require(bytes(message).length > 0, "Message required");
        require(bytes(message).length <= 500, "Message too long");
        
        tokenComments[tokenAddress].push(Comment({
            author: msg.sender,
            message: message,
            timestamp: block.timestamp
        }));
        
        emit CommentAdded(tokenAddress, msg.sender, message, block.timestamp);
    }
    
    /**
     * @dev Get comments for a token
     * @param tokenAddress Token address
     * @return comments Array of comments
     */
    function getComments(address tokenAddress) external view returns (Comment[] memory) {
        return tokenComments[tokenAddress];
    }
    
    /**
     * @dev Get token info
     * @param tokenAddress Token address
     * @return info Token info struct
     */
    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory info) {
        require(isToken[tokenAddress], "Invalid token");
        
        NexusPumpToken token = NexusPumpToken(tokenAddress);
        
        info = TokenInfo({
            tokenAddress: tokenAddress,
            name: token.name(),
            symbol: token.symbol(),
            description: token.description(),
            imageUrl: token.imageUrl(),
            website: token.website(),
            twitter: token.twitter(),
            telegram: token.telegram(),
            creator: token.creator(),
            createdAt: token.createdAt(),
            totalRaised: token.totalRaised(),
            graduated: token.graduated()
        });
        
        return info;
    }
    
    /**
     * @dev Get all tokens with pagination
     * @param offset Start index
     * @param limit Number of tokens to return
     * @return infos Array of token info structs
     */
    function getAllTokens(uint256 offset, uint256 limit) external view returns (TokenInfo[] memory infos) {
        uint256 total = tokens.length;
        
        if (offset >= total) {
            return new TokenInfo[](0);
        }
        
        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }
        
        uint256 size = end - offset;
        infos = new TokenInfo[](size);
        
        for (uint256 i = 0; i < size; i++) {
            address tokenAddress = tokens[offset + i];
            NexusPumpToken token = NexusPumpToken(tokenAddress);
            
            infos[i] = TokenInfo({
                tokenAddress: tokenAddress,
                name: token.name(),
                symbol: token.symbol(),
                description: token.description(),
                imageUrl: token.imageUrl(),
                website: token.website(),
                twitter: token.twitter(),
                telegram: token.telegram(),
                creator: token.creator(),
                createdAt: token.createdAt(),
                totalRaised: token.totalRaised(),
                graduated: token.graduated()
            });
        }
        
        return infos;
    }
    
    /**
     * @dev Get total number of tokens
     * @return count Total token count
     */
    function getTokenCount() external view returns (uint256) {
        return tokens.length;
    }
    
    /**
     * @dev Receive NEX
     */
    receive() external payable {}
}
