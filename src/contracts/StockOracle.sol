pragma solidity ^0.5.10;

contract StockOracle{
    struct supply{
        uint256 cost;
        uint256 volume;
    }
    
    mapping (bytes4=>supply) stockQuote;
    
    address oracleOwner;
    
    function getStockVolume(bytes4 flag) public view returns (uint){
        return stockQuote[flag].volume;
    }
        
    function getStockPrice(bytes4 flag) public view returns (uint) {
        return stockQuote[flag].cost;
    }
    
    function setStock(bytes4 flag, uint256 _cost, uint256 _volume) public returns (uint) {
        stockQuote[flag] = supply(_cost, _volume);
    }


}