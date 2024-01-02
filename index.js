require("dotenv").config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const QUICKNODE_RPC_URL = process.env.QUICKNODE_RPC_URL;

const app = express();

const PORT="3000";
// Middleware to parse JSON request bodies
app.use(bodyParser.json());

app.get('/api/fetch', async (req, res) => {
  try{
    const { wallet, page,collection } = req.body;
    const response = await axios.post(
        QUICKNODE_RPC_URL, 
        {
          id: 67,
          jsonrpc: '2.0',
          method: 'qn_fetchNFTs',
          params: [{
            wallet:wallet,
            page: parseInt(page),
            perPage: 10,
            contracts: [
              collection
            ]
          }]
        }, 
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      console.log("---");
      console.log(response.data);
      console.log("---");
      res.send(response.data);
  }
  catch (error) {
    console.error('Error occurred:', error);
    // Send a generic error response or customize based on the error
    res.status(500).json({ message: 'An error occurred while fetching data' });
  }
});

app.post('/api/infoCollection', async (req, res) => {
   try{
    const {collection, page } = req.body;

      const response = await axios.post(
        QUICKNODE_RPC_URL, 
        {
          id: 67,
          jsonrpc: '2.0',
          method: 'qn_fetchNFTsByCollection',
          params: [{
            collection:collection,
            page: parseInt(page),
            perPage: 10
          }]
        }, 
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (response.data.result.totalPages === 0) {
        res.status(204).json({ message: 'No data available' });
      }
      else{

          res.status(200).json({sections:`Total of Sections:` +response.data.result.totalPages,total:`Total of NFTS in your collection:` + response.data.result.totalItems })
        
      }
    }
    
    catch (error) {
        console.error('Error occurred:', error);
        // Send a generic error response or customize based on the error
        res.status(500).json({ message: 'An error occurred while fetching data' });
      }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});