// ==========================================
// UPLOAD SERVICE - Image Upload to External API
// ==========================================

const IMAGE_UPLOAD_URL = 'https://images.cradlevoices.com';

const uploadService = {
  // Upload single image to external hosting
  async uploadSingle(file) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const response = await fetch(IMAGE_UPLOAD_URL, {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    });

    const result = await response.json();

    if (result.status === 'success') {
      return {
        success: true,
        url: result.file.url,
        name: result.file.name,
        size: result.file.size,
        type: result.file.type
      };
    } else {
      throw new Error(result.message || 'Upload failed');
    }
  },

  // Upload multiple images one by one and return array of URLs
  async uploadMultiple(files) {
    const uploadedUrls = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await this.uploadSingle(file);
        uploadedUrls.push({
          url: result.url,
          name: result.name,
          originalName: file.name
        });
      } catch (error) {
        errors.push({
          file: file.name,
          error: error.message
        });
      }
    }

    return {
      success: errors.length === 0,
      uploaded: uploadedUrls,
      errors: errors,
      urls: uploadedUrls.map(u => u.url) // Array of just URLs for easy use
    };
  },

  // Get full image URL (for compatibility)
  getImageUrl(url) {
    if (!url) return null;
    
    // If already a full URL, return as is
    if (url.startsWith('http')) {
      return url;
    }
    
    // Otherwise return as is (might be a relative path)
    return url;
  },

  // Validate file before upload
  validateFile(file, maxSizeMB = 10) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Use JPEG, PNG, GIF, or WebP.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: `File too large. Max size is ${maxSizeMB}MB.` };
    }

    return { valid: true };
  },

  // Validate multiple files
  validateFiles(files, maxSizeMB = 10) {
    const results = [];
    for (const file of files) {
      const validation = this.validateFile(file, maxSizeMB);
      if (!validation.valid) {
        results.push({ file: file.name, ...validation });
      }
    }
    return {
      valid: results.length === 0,
      errors: results
    };
  }
};

export default uploadService;
