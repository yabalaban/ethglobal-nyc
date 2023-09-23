import { defineConfig } from '@wagmi/cli';
import { foundry, react } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'src/web3/contracts.ts',
  plugins: [
    react(),
    foundry({
      project: '../../packages/contracts',
    }),
  ],
});
