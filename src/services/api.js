// ==========================================
// API CLIENT - Axios Configuration
// ==========================================

const API_BASE_URL = 'https://vault.impalapay.com/api';

// Create a simple fetch wrapper with interceptors
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  }

  // Build headers
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle response
  async handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Handle 401 - Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }

      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        errors: data.errors || [],
      };
    }

    return data;
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `${this.baseURL}${endpoint}?${queryString}` 
      : `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // POST request
  async post(endpoint, data = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  // PUT request
  async put(endpoint, data = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  // DELETE request
  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Upload file(s)
  async upload(endpoint, formData) {
    const token = this.getToken();
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse(response);
  }
}

// Export singleton instance
const api = new ApiClient(API_BASE_URL);

export default api;
export { API_BASE_URL };

