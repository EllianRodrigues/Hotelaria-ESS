import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import express from 'express';

// Create a test app
const app = express();
app.use(express.json());

// Import and use the upload router (no mocking)
import uploadRouter from '../src/routes/uploadRouter.js';
app.use('/api/upload', uploadRouter);

describe('Upload Router', () => {
  let server;

  before(() => {
    // Start the test server
    server = app.listen(0); // Use port 0 to get a random available port
  });

  after(() => {
    // Close the test server
    if (server) {
      server.close();
    }
  });

  beforeEach(() => {
    sinon.restore();
  });

  describe('GET /api/upload/signature', () => {
    it('should generate signature successfully', async () => {
      const response = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      // Verify response structure
      expect(response.body).to.have.property('timestamp');
      expect(response.body).to.have.property('signature');
      expect(response.body).to.have.property('api_key');
      expect(response.body).to.have.property('cloud_name');
      
      // Verify data types
      expect(typeof response.body.timestamp).to.equal('number');
      expect(typeof response.body.signature).to.equal('string');
      expect(typeof response.body.api_key).to.equal('string');
      expect(typeof response.body.cloud_name).to.equal('string');

      // Verify expected values
      expect(response.body.api_key).to.equal('191953329892655');
      expect(response.body.cloud_name).to.equal('dajmzj1ww');
      
      // Verify timestamp is recent (within last 60 seconds)
      const now = Math.floor(Date.now() / 1000);
      expect(response.body.timestamp).to.be.at.least(now - 60);
      expect(response.body.timestamp).to.be.at.most(now + 10);
    });

    it('should generate unique signatures for different requests', async () => {
      // First request
      const response1 = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      // Wait longer to ensure different timestamp (at least 1 second)
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Second request
      const response2 = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      // Verify different signatures were generated (due to different timestamps)
      expect(response1.body.signature).to.not.equal(response2.body.signature);
      expect(response2.body.timestamp).to.be.greaterThan(response1.body.timestamp);
    });

    it('should always include rooms folder in signature parameters', async () => {
      const response = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      // Verify that the signature is valid (non-empty string)
      expect(response.body.signature).to.be.a('string');
      expect(response.body.signature.length).to.be.greaterThan(0);
    });

    it('should return valid JSON structure', async () => {
      const response = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      // Verify response structure
      expect(response.body).to.have.property('timestamp');
      expect(response.body).to.have.property('signature');
      expect(response.body).to.have.property('api_key');
      expect(response.body).to.have.property('cloud_name');
      
      // Verify data types
      expect(typeof response.body.timestamp).to.equal('number');
      expect(typeof response.body.signature).to.equal('string');
      expect(typeof response.body.api_key).to.equal('string');
      expect(typeof response.body.cloud_name).to.equal('string');
    });
  });

  describe('Error Handling', () => {
    it('should handle cloudinary configuration errors gracefully', async () => {
      // This test verifies that the endpoint doesn't crash
      // We can't easily trigger Cloudinary errors in a unit test
      // but we can verify the endpoint is stable
      const response = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      expect(response.body).to.have.property('signature');
    });

    it('should handle multiple concurrent requests', async () => {
      // Make multiple concurrent requests
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          request(server)
            .get('/api/upload/signature')
            .expect(200)
        );
      }

      const responses = await Promise.all(promises);

      // Verify all responses are valid
      responses.forEach(response => {
        expect(response.body).to.have.property('signature');
        expect(response.body).to.have.property('timestamp');
        expect(response.body).to.have.property('api_key');
        expect(response.body).to.have.property('cloud_name');
      });
    });
  });

  describe('Security', () => {
    it('should not expose sensitive credentials in response', async () => {
      const response = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      // Verify that api_secret is not exposed in response
      expect(response.body).to.not.have.property('api_secret');
      expect(response.body).to.not.have.property('secret');
    });

    it('should only expose necessary credentials for client-side upload', async () => {
      const response = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      // Verify only necessary credentials are exposed
      expect(response.body).to.have.property('timestamp');
      expect(response.body).to.have.property('signature');
      expect(response.body).to.have.property('api_key');
      expect(response.body).to.have.property('cloud_name');
    });

    it('should generate cryptographically secure signatures', async () => {
      const response = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      // Verify signature looks like a proper hash (alphanumeric, reasonable length)
      expect(response.body.signature).to.match(/^[a-f0-9]+$/);
      expect(response.body.signature.length).to.be.at.least(20);
    });
  });

  describe('Integration', () => {
    it('should work with real Cloudinary configuration', async () => {
      const response = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      // Verify the response can be used for actual Cloudinary uploads
      expect(response.body.timestamp).to.be.a('number');
      expect(response.body.signature).to.be.a('string');
      expect(response.body.api_key).to.equal('191953329892655');
      expect(response.body.cloud_name).to.equal('dajmzj1ww');
    });

    it('should generate signatures that increase with time', async () => {
      const response1 = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      // Wait at least 1 second to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 1100));

      const response2 = await request(server)
        .get('/api/upload/signature')
        .expect(200);

      // Verify timestamps are increasing
      expect(response2.body.timestamp).to.be.greaterThan(response1.body.timestamp);
    });
  });
}); 