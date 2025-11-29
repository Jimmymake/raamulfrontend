// ==========================================
// ADMIN SETTINGS PAGE
// ==========================================

import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout/AdminLayout';
import { LoadingSpinner } from '../../../components/common';
import { useNotification } from '../../../context/NotificationContext';
import './AdminSettings.scss';

const AdminSettings = () => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState({
    // General
    siteName: 'Raamul International',
    siteDescription: 'B2B E-commerce Platform',
    contactEmail: 'info@raamul.co.ke',
    contactPhone: '+254 700 123 456',
    address: 'Westlands Business Park, Nairobi',
    
    // Store
    currency: 'KES',
    taxRate: 16,
    minOrderAmount: 1000,
    freeShippingThreshold: 5000,
    
    // Notifications
    orderNotifications: true,
    stockAlerts: true,
    marketingEmails: false,
    smsNotifications: true,
    
    // Payment
    mpesaEnabled: true,
    cardEnabled: false,
    bankTransferEnabled: true,
    mpesaPaybill: '174379',
    mpesaAccountNumber: 'RAAMUL',
    
    // Shipping
    standardDeliveryDays: '3-5',
    expressDeliveryDays: '1-2',
    standardDeliveryFee: 200,
    expressDeliveryFee: 500
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    showNotification('Settings saved successfully!', 'success');
    setLoading(false);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'store', label: 'Store', icon: '🏪' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'shipping', label: 'Shipping', icon: '🚚' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  return (
    <AdminLayout>
      <div className="admin-settings">
        <div className="admin-settings__header">
          <h1>Settings</h1>
          <button 
            className="admin-settings__save"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : '💾'} Save Changes
          </button>
        </div>

        <div className="admin-settings__layout">
          {/* Tabs */}
          <nav className="admin-settings__tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`admin-settings__tab ${activeTab === tab.id ? 'admin-settings__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="admin-settings__tab-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="admin-settings__content">
            {activeTab === 'general' && (
              <div className="admin-settings__section">
                <h2>General Settings</h2>
                <p className="admin-settings__section-desc">Basic information about your store</p>

                <div className="admin-settings__form">
                  <div className="admin-settings__field">
                    <label>Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleChange('siteName', e.target.value)}
                    />
                  </div>

                  <div className="admin-settings__field">
                    <label>Site Description</label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleChange('siteDescription', e.target.value)}
                      rows="3"
                    />
                  </div>

                  <div className="admin-settings__row">
                    <div className="admin-settings__field">
                      <label>Contact Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                      />
                    </div>
                    <div className="admin-settings__field">
                      <label>Contact Phone</label>
                      <input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-settings__field">
                    <label>Business Address</label>
                    <textarea
                      value={settings.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'store' && (
              <div className="admin-settings__section">
                <h2>Store Settings</h2>
                <p className="admin-settings__section-desc">Configure your store preferences</p>

                <div className="admin-settings__form">
                  <div className="admin-settings__row">
                    <div className="admin-settings__field">
                      <label>Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                      >
                        <option value="KES">KES - Kenyan Shilling</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                    <div className="admin-settings__field">
                      <label>Tax Rate (%)</label>
                      <input
                        type="number"
                        value={settings.taxRate}
                        onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="admin-settings__row">
                    <div className="admin-settings__field">
                      <label>Minimum Order Amount (KES)</label>
                      <input
                        type="number"
                        value={settings.minOrderAmount}
                        onChange={(e) => handleChange('minOrderAmount', parseInt(e.target.value))}
                        min="0"
                      />
                    </div>
                    <div className="admin-settings__field">
                      <label>Free Shipping Threshold (KES)</label>
                      <input
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => handleChange('freeShippingThreshold', parseInt(e.target.value))}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="admin-settings__section">
                <h2>Payment Settings</h2>
                <p className="admin-settings__section-desc">Configure payment methods</p>

                <div className="admin-settings__form">
                  <div className="admin-settings__toggle-group">
                    <div className="admin-settings__toggle">
                      <div>
                        <strong>M-Pesa</strong>
                        <span>Accept M-Pesa payments</span>
                      </div>
                      <label className="admin-settings__switch">
                        <input
                          type="checkbox"
                          checked={settings.mpesaEnabled}
                          onChange={(e) => handleChange('mpesaEnabled', e.target.checked)}
                        />
                        <span className="admin-settings__slider" />
                      </label>
                    </div>

                    {settings.mpesaEnabled && (
                      <div className="admin-settings__sub-fields">
                        <div className="admin-settings__field">
                          <label>Paybill Number</label>
                          <input
                            type="text"
                            value={settings.mpesaPaybill}
                            onChange={(e) => handleChange('mpesaPaybill', e.target.value)}
                          />
                        </div>
                        <div className="admin-settings__field">
                          <label>Account Number</label>
                          <input
                            type="text"
                            value={settings.mpesaAccountNumber}
                            onChange={(e) => handleChange('mpesaAccountNumber', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="admin-settings__toggle">
                      <div>
                        <strong>Card Payments</strong>
                        <span>Accept credit/debit cards</span>
                      </div>
                      <label className="admin-settings__switch">
                        <input
                          type="checkbox"
                          checked={settings.cardEnabled}
                          onChange={(e) => handleChange('cardEnabled', e.target.checked)}
                        />
                        <span className="admin-settings__slider" />
                      </label>
                    </div>

                    <div className="admin-settings__toggle">
                      <div>
                        <strong>Bank Transfer</strong>
                        <span>Accept bank transfers</span>
                      </div>
                      <label className="admin-settings__switch">
                        <input
                          type="checkbox"
                          checked={settings.bankTransferEnabled}
                          onChange={(e) => handleChange('bankTransferEnabled', e.target.checked)}
                        />
                        <span className="admin-settings__slider" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="admin-settings__section">
                <h2>Shipping Settings</h2>
                <p className="admin-settings__section-desc">Configure delivery options</p>

                <div className="admin-settings__form">
                  <h3>Standard Delivery</h3>
                  <div className="admin-settings__row">
                    <div className="admin-settings__field">
                      <label>Delivery Time</label>
                      <input
                        type="text"
                        value={settings.standardDeliveryDays}
                        onChange={(e) => handleChange('standardDeliveryDays', e.target.value)}
                        placeholder="e.g., 3-5 days"
                      />
                    </div>
                    <div className="admin-settings__field">
                      <label>Delivery Fee (KES)</label>
                      <input
                        type="number"
                        value={settings.standardDeliveryFee}
                        onChange={(e) => handleChange('standardDeliveryFee', parseInt(e.target.value))}
                        min="0"
                      />
                    </div>
                  </div>

                  <h3>Express Delivery</h3>
                  <div className="admin-settings__row">
                    <div className="admin-settings__field">
                      <label>Delivery Time</label>
                      <input
                        type="text"
                        value={settings.expressDeliveryDays}
                        onChange={(e) => handleChange('expressDeliveryDays', e.target.value)}
                        placeholder="e.g., 1-2 days"
                      />
                    </div>
                    <div className="admin-settings__field">
                      <label>Delivery Fee (KES)</label>
                      <input
                        type="number"
                        value={settings.expressDeliveryFee}
                        onChange={(e) => handleChange('expressDeliveryFee', parseInt(e.target.value))}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="admin-settings__section">
                <h2>Notification Settings</h2>
                <p className="admin-settings__section-desc">Manage your notification preferences</p>

                <div className="admin-settings__form">
                  <div className="admin-settings__toggle-group">
                    <div className="admin-settings__toggle">
                      <div>
                        <strong>Order Notifications</strong>
                        <span>Get notified when new orders are placed</span>
                      </div>
                      <label className="admin-settings__switch">
                        <input
                          type="checkbox"
                          checked={settings.orderNotifications}
                          onChange={(e) => handleChange('orderNotifications', e.target.checked)}
                        />
                        <span className="admin-settings__slider" />
                      </label>
                    </div>

                    <div className="admin-settings__toggle">
                      <div>
                        <strong>Stock Alerts</strong>
                        <span>Get alerts when products are low in stock</span>
                      </div>
                      <label className="admin-settings__switch">
                        <input
                          type="checkbox"
                          checked={settings.stockAlerts}
                          onChange={(e) => handleChange('stockAlerts', e.target.checked)}
                        />
                        <span className="admin-settings__slider" />
                      </label>
                    </div>

                    <div className="admin-settings__toggle">
                      <div>
                        <strong>Marketing Emails</strong>
                        <span>Receive marketing and promotional emails</span>
                      </div>
                      <label className="admin-settings__switch">
                        <input
                          type="checkbox"
                          checked={settings.marketingEmails}
                          onChange={(e) => handleChange('marketingEmails', e.target.checked)}
                        />
                        <span className="admin-settings__slider" />
                      </label>
                    </div>

                    <div className="admin-settings__toggle">
                      <div>
                        <strong>SMS Notifications</strong>
                        <span>Receive important updates via SMS</span>
                      </div>
                      <label className="admin-settings__switch">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                        />
                        <span className="admin-settings__slider" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

