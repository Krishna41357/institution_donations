const express = require('express');
const cors = require('cors');
const { AptosClient } = require('aptos');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Aptos client setup
const NODE_URL = 'https://fullnode.devnet.aptoslabs.com/v1';
const MODULE_ADDRESS = '0xc506346580e6d8b7f72d61f77af400ef015e484c22ed6ab27b1ea93d33812d01';
const MODULE_NAME = 'AlumniDonation';

const client = new AptosClient(NODE_URL);

// Get pool status
app.get('/api/pool-status/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const resources = await client.getAccountResources(address);
    const poolResource = resources.find(r => 
      r.type === `${MODULE_ADDRESS}::${MODULE_NAME}::DonationPool`
    );
    
    if (poolResource) {
      return res.json({
        initialized: true,
        totalDonations: poolResource.data.total_donations
      });
    } else {
      return res.json({ initialized: false, totalDonations: 0 });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch pool status' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});