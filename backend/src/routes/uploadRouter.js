import express from 'express';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dajmzj1ww',
  api_key: '191953329892655',
  api_secret: 'XADc7iml0LCgv_VVOBPNUF4t_Z0'
});

// Rota para gerar assinatura para upload
router.get('/signature', (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'rooms'
      },
      'XADc7iml0LCgv_VVOBPNUF4t_Z0'
    );

    res.json({
      timestamp: timestamp,
      signature: signature,
      api_key: '191953329892655',
      cloud_name: 'dajmzj1ww'
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ error: 'Failed to generate signature' });
  }
});

export default router; 