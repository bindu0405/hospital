async function retryWithExponentialBackoff(func, maxRetries = 3, baseDelay = 1000) {
    let retries = 0;
  
    while (retries < maxRetries) {
      try {
        const result = await func();
        return result; // If successful, return the result
      } catch (error) {
        if (error.code === 429) {
          // Rate limit exceeded, apply exponential backoff
          const delay = baseDelay * Math.pow(2, retries);
          console.warn(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
        } else {
          throw error; // Re-throw other errors
        }
      }
    }
  
    throw new Error('Max retries reached. Unable to complete the operation.');
  }
  module.exports={retryWithExponentialBackoff}