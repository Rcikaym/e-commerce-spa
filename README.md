# Mono Craft, Minimalist E-Commerce SPA

A React single-page application for a minimalist Japanese homeware store. Built with zero UI frameworks, plain CSS, and intentional design decisions.

## Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Run Tests

```bash
npm test
```

## Folder Structure

```
src/
├── api/              # Mock API layer, async functions with simulated latency
├── context/          # React Context + useReducer for global cart state
├── data/             # Raw product data (20 items, 4 categories)
├── hooks/            # Custom hooks: useProducts (data fetching), useDebounce
├── components/
│   ├── Layout/       # Navbar, Footer (app shell)
│   ├── Product/      # ProductCard, ProductGrid (product display)
│   ├── Cart/         # CartItem (cart line item component)
│   ├── Skeleton/     # SkeletonCard (CSS shimmer loading states)
│   └── UI/           # Button, Input, ImagePlaceholder (design primitives)
├── pages/            # Route-level page components
│   ├── HomePage      # Hero, featured products (category strip)
│   ├── SearchPage    # Search + filter + URL-synced results
│   ├── ProductDetailPage # Two-column detail with related products
│   ├── CartPage      # Line items + order summary
│   └── CheckoutPage  # Single-page form with inline confirmation
├── tests/            # React Testing Library tests (1 per page + cart context)
├── App.jsx           # Route definitions + layout
├── App.css           # Route-level layout styles
├── main.jsx          # Entry point
└── index.css         # :root design tokens + CSS reset
```

## Tech Stack

- **React** (Vite)
- **react-router-dom** v6 , SPA routing
- **prop-types** , runtime prop validation
- Plain CSS with Custom Properties , design tokens
- Native `fetch` patterns (simulated via mock API)
- React Context + `useReducer` , cart state management

## License

MIT
