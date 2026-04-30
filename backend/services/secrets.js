/**
 * Google Cloud Secret Manager client for secure API key retrieval.
 * Provides secure access to secrets stored in Google Cloud.
 * @module services/secrets
 */

/**
 * Retrieves a secret value from Google Cloud Secret Manager.
 * @param {string} secretName - The name of the secret to access.
 * @returns {Promise<string>} The secret value as a UTF-8 string.
 * @throws {Error} If the secret cannot be accessed or does not exist.
 */
async function getSecret(secretName) {
  const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/secrets/${secretName}/versions/latest`,
  });
  return version.payload.data.toString('utf8');
}

module.exports = { getSecret };
