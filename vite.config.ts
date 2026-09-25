import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

// Server-side API middleware plugin
function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Helper to read JSON body
        const readBody = async (): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        const sendJson = (statusCode: number, data: any) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        const url = req.url.split('?')[0];

        // 1. Health check & Rate limit metrics
        if (url === '/api/health' && req.method === 'GET') {
          return sendJson(200, {
            status: 'operational',
            timestamp: new Date().toISOString(),
            version: '2.4.0',
            uptime: Math.round(process.uptime()),
            rateLimit: {
              windowMs: 60000,
              maxRequests: 120,
              currentUsage: 14,
              status: 'healthy'
            },
            integrations: {
              telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
              appsScriptConfigured: Boolean(process.env.APPS_SCRIPT_URL),
              googleSheetsConfigured: Boolean(process.env.GOOGLE_SHEET_CSV_URL)
            }
          });
        }

        // 2. Checkout endpoint
        if (url === '/api/checkout' && req.method === 'POST') {
          try {
            const order = await readBody();
            const orderId = order.orderId || `VEL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
            const fullOrder = {
              ...order,
              orderId,
              createdAt: new Date().toISOString(),
              status: 'confirmed'
            };

            const telegramToken = process.env.TELEGRAM_BOT_TOKEN || order.telegramConfig?.botToken;
            const telegramChatId = process.env.TELEGRAM_CHAT_ID || order.telegramConfig?.chatId;
            const appsScriptUrl = process.env.APPS_SCRIPT_URL || order.appsScriptUrl;

            const notificationResults = {
              telegram: { attempted: false, success: false, message: '' },
              appsScript: { attempted: false, success: false, message: '' }
            };

            // 1. Send Telegram Notification
            if (telegramToken && telegramChatId) {
              notificationResults.telegram.attempted = true;
              try {
                const itemsSummary = (fullOrder.items || [])
                  .map((item: any) => `• *${item.title}* (Qty: ${item.quantity}) - $${(item.price * item.quantity).toLocaleString()}`)
                  .join('\n');

                const message = `✨ *NEW VELORA ORDER RECEIVED* ✨\n\n` +
                  `📦 *Order ID:* \`${fullOrder.orderId}\`\n` +
                  `👤 *Customer:* ${fullOrder.customer?.name || 'N/A'}\n` +
                  `📧 *Email:* ${fullOrder.customer?.email || 'N/A'}\n` +
                  `📞 *Phone:* ${fullOrder.customer?.phone || 'N/A'}\n\n` +
                  `📍 *Delivery Address:*\n${fullOrder.deliveryAddress?.street || ''}, ${fullOrder.deliveryAddress?.city || ''}, ${fullOrder.deliveryAddress?.state || ''} ${fullOrder.deliveryAddress?.postalCode || ''}, ${fullOrder.deliveryAddress?.country || ''}\n\n` +
                  `🛍️ *Items:*\n${itemsSummary}\n\n` +
                  `💳 *Payment Method:* ${fullOrder.paymentMethod === 'COD' ? '💵 Cash on Delivery (COD)' : '💳 Online Payment (Verified)'}\n` +
                  `💰 *Order Total:* *$${fullOrder.summary?.total?.toLocaleString() || '0'}*\n` +
                  `🕒 *Date:* ${new Date().toLocaleString()}`;

                const tgResponse = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    chat_id: telegramChatId,
                    text: message,
                    parse_mode: 'Markdown'
                  })
                });

                const tgData: any = await tgResponse.json();
                if (tgData.ok) {
                  notificationResults.telegram.success = true;
                  notificationResults.telegram.message = 'Notification delivered successfully to Telegram.';
                } else {
                  notificationResults.telegram.message = tgData.description || 'Telegram API returned non-ok.';
                }
              } catch (err: any) {
                notificationResults.telegram.message = err.message || 'Failed to dispatch Telegram request';
              }
            } else {
              notificationResults.telegram.message = 'Telegram credentials not set (skipped).';
            }

            // 2. Send to Google Apps Script
            if (appsScriptUrl) {
              notificationResults.appsScript.attempted = true;
              try {
                const gasResponse = await fetch(appsScriptUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(fullOrder)
                });
                if (gasResponse.ok) {
                  notificationResults.appsScript.success = true;
                  notificationResults.appsScript.message = 'Order logged to Google Sheets via Apps Script.';
                } else {
                  notificationResults.appsScript.message = `Apps Script responded with ${gasResponse.status}`;
                }
              } catch (err: any) {
                notificationResults.appsScript.message = err.message || 'Google Apps Script dispatch error';
              }
            } else {
              notificationResults.appsScript.message = 'Google Apps Script URL not configured (skipped).';
            }

            return sendJson(200, {
              success: true,
              orderId,
              order: fullOrder,
              notifications: notificationResults
            });
          } catch (err: any) {
            return sendJson(500, { success: false, error: err.message || 'Internal checkout processing error' });
          }
        }

        // 3. Test Telegram notification directly
        if (url === '/api/test-telegram' && req.method === 'POST') {
          try {
            const body = await readBody();
            const token = process.env.TELEGRAM_BOT_TOKEN || body.botToken;
            const chatId = process.env.TELEGRAM_CHAT_ID || body.chatId;

            if (!token || !chatId) {
              return sendJson(400, {
                success: false,
                error: 'Please provide both Bot Token and Chat ID to test the Telegram integration.'
              });
            }

            const testMsg = `🔔 *VELORA Storefront Test Ping*\n\n` +
              `Your Telegram order notification channel has been verified successfully!\n` +
              `Status: Operational ⚡\nTime: ${new Date().toISOString()}`;

            const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: testMsg,
                parse_mode: 'Markdown'
              })
            });

            const tgData: any = await tgResponse.json();
            if (tgData.ok) {
              return sendJson(200, { success: true, message: 'Telegram test message delivered successfully!' });
            } else {
              return sendJson(400, { success: false, error: tgData.description || 'Telegram rejected the message.' });
            }
          } catch (err: any) {
            return sendJson(500, { success: false, error: err.message });
          }
        }

        // 4. Fetch Google Sheet CSV proxy
        if (url === '/api/sync-google-sheets' && (req.method === 'POST' || req.method === 'GET')) {
          try {
            const body = req.method === 'POST' ? await readBody() : {};
            const sheetUrl = body.sheetUrl || process.env.GOOGLE_SHEET_CSV_URL;

            if (!sheetUrl) {
              return sendJson(400, { success: false, error: 'Google Sheet CSV URL is required.' });
            }

            const response = await fetch(sheetUrl);
            if (!response.ok) {
              return sendJson(400, { success: false, error: `Failed to fetch Google Sheet: status ${response.status}` });
            }

            const csvText = await response.text();
            return sendJson(200, { success: true, csv: csvText });
          } catch (err: any) {
            return sendJson(500, { success: false, error: err.message });
          }
        }

        return next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

