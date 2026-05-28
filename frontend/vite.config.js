import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: true,
      },

      includeAssets: [
        "favicon.svg",
      ],

      manifest: {
        name: "KinnectHub",

        short_name: "KinnectHub",

        description:
        "Private family digital platform",
        
        theme_color: "#111827",

        display: "standalone",
        
        start_url: "/",

        icons: [
          {
            src: "/icons/icon-192.png",

            sizes: "192x192",

            type: "image/png",
          },

          {
            src: "/icons/icon-512.png",

            sizes: "512x512",

            type: "image/png",
          },
        ],
      },
    }),
  ],
});
