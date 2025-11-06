# Solana Analytics Platform

A full-stack blockchain analysis platform for the Solana network, featuring real-time data tracking, token analysis, pool monitoring, whale tracking, and block exploration.

## Features

- **Token Analyzer**: Analyze Solana tokens, view metadata, supply, and metrics
- **Pool Monitor**: Monitor liquidity pools and trading activity
- **Whale Tracker**: Track large transactions and whale wallets
- **Block Explorer**: Explore recent blocks and transaction volumes
- **Real-time Updates**: WebSocket support for live data streaming
- **Dark Mode**: Full dark mode support with smooth transitions
- **Responsive Design**: Mobile-friendly interface with TailwindCSS

## Tech Stack

### Backend
- Node.js & Express.js
- TypeScript
- @solana/web3.js v1.87.0+
- WebSocket (ws)
- Rate limiting & security middleware

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- TailwindCSS
- Recharts for data visualization

## Project Structure

```
SolanaAnalyticsSuite/
├── backend/
│   ├── src/
│   │   ├── middleware/       # Error handling, rate limiting, logging
│   │   ├── routes/           # API route handlers
│   │   ├── services/         # Solana service, WebSocket service
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   └── server.ts         # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # API client and utilities
│   │   ├── styles/           # CSS and Tailwind styles
│   │   ├── App.tsx           # Main App component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SolanaAnalyticsSuite
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

#### Backend Configuration

1. Copy the environment template:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   CORS_ORIGIN=http://localhost:5173
   ```

   **RPC Provider Options:**
   - Free: `https://api.mainnet-beta.solana.com` (rate limited)
   - Helius: `https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY`
   - QuickNode: `https://your-endpoint.quiknode.pro/YOUR_API_KEY/`
   - Alchemy: `https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY`

#### Frontend Configuration

1. Copy the environment template:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_WS_URL=ws://localhost:3001/ws
   ```

### Running the Application

#### Development Mode

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:3001

2. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173

3. **Access the application:**
   Open your browser and navigate to http://localhost:5173

#### Production Build

1. **Build the backend:**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Token Endpoints
- `GET /api/tokens/:address` - Get token information
- `GET /api/tokens/:address/holders` - Get token holders (placeholder)

### Pool Endpoints
- `GET /api/pools/:address` - Get pool information
- `GET /api/pools` - Get all pools (placeholder)

### Whale Tracker Endpoints
- `GET /api/whales/address/:address?limit=10` - Get transactions for wallet
- `GET /api/whales/balance/:address` - Get wallet balance
- `GET /api/whales/transactions?limit=20` - Get whale transactions (placeholder)

### Block Explorer Endpoints
- `GET /api/blocks/recent?limit=10` - Get recent blocks
- `GET /api/blocks/:slot` - Get block by slot (placeholder)

## WebSocket

Connect to `ws://localhost:3001/ws` for real-time updates.

**Message Format:**
```json
{
  "type": "subscribe|unsubscribe|ping",
  "payload": {
    "channel": "blocks|transactions|pools"
  }
}
```

**Response Format:**
```json
{
  "type": "update|subscribed|connected",
  "channel": "blocks",
  "data": {...},
  "timestamp": 1234567890
}
```

## Scripts

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

### Frontend Scripts
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## Development

### Code Style

This project uses ESLint and Prettier for code formatting and linting.

- Run `npm run lint` to check for issues
- Run `npm run format` to format code
- Both backend and frontend follow the same code style conventions

### Adding New Features

1. **Backend:**
   - Add routes in `backend/src/routes/`
   - Add services in `backend/src/services/`
   - Add types in `backend/src/types/`

2. **Frontend:**
   - Add pages in `frontend/src/pages/`
   - Add components in `frontend/src/components/`
   - Add types in `frontend/src/types/`
   - Update routes in `frontend/src/App.tsx`

## Best Practices

### Error Handling
- All API endpoints use async error handling
- Centralized error middleware
- Proper HTTP status codes
- User-friendly error messages

### Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting on API endpoints
- Input validation with Zod (backend)

### Performance
- Efficient Solana RPC calls
- Response caching (where appropriate)
- Optimized React rendering
- Code splitting with React Router

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Change `PORT` in backend `.env`
   - Change `server.port` in frontend `vite.config.ts`

2. **RPC rate limiting:**
   - Use a paid RPC provider (Helius, QuickNode, Alchemy)
   - Implement response caching
   - Reduce request frequency

3. **WebSocket connection fails:**
   - Check firewall settings
   - Verify WebSocket URL in frontend `.env`
   - Ensure backend server is running

4. **Build errors:**
   - Delete `node_modules` and reinstall
   - Clear TypeScript cache: `rm -rf node_modules/.cache`
   - Check Node.js version compatibility

## Learning Resources

- [Solana Documentation](https://docs.solana.com/)
- [Solana Web3.js Guide](https://solana-labs.github.io/solana-web3.js/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## Roadmap

- [ ] Token metadata integration (Metaplex)
- [ ] DEX integration (Raydium, Orca)
- [ ] Advanced charting and analytics
- [ ] Portfolio tracking
- [ ] Price alerts and notifications
- [ ] Historical data analysis
- [ ] Mobile responsive improvements
- [ ] Performance optimizations
- [ ] User authentication
- [ ] Saved watchlists

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue on GitHub.