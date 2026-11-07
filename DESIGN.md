# Design Doc: Artwork Secondary Market (MERN)

Date: 2026-10-23

## 1. Overview and architecture

A three-tier MERN app: a React single-page app calls a stateless Express REST API, which stores data in MongoDB. It implements the PRD demo scope (see [PRD.md](PRD.md)): listings, admin approval, offers, buy now (mock payment) and seller ratings. No messaging, no delivery tracking.

| Layer | Choice | Role |
| --- | --- | --- |
| Frontend | React with Vite, React Router, Axios | Pages, forms, calls the API |
| Backend | Node.js, Express | REST API, auth, business rules |
| Database | MongoDB with Mongoose | Users, listings, offers, orders, ratings |
| Auth | JWT in an Authorization header, bcrypt for passwords | Stateless sessions |
| Images | Multer, saved to a local uploads folder | Listing photos (max 5 per listing) |

**Design decisions**

- One Express app with route, controller and model folders; no microservices.
- Roles on the user (buyer, seller, admin); one user can both buy and sell, so buyer and seller are not exclusive. Admin is set directly in the database or a seed script.
- A listing's price is stored in whole euros as a number; currency is fixed to EUR for the demo.
- Payment is a mock: the endpoint marks the order paid without calling any provider.

## 2. Data models (Mongoose)

Five collections. All have `createdAt` and `updatedAt` (Mongoose timestamps).

| Collection | Fields | Notes |
| --- | --- | --- |
| User | name, email (unique), passwordHash, role (user or admin), ratingAvg, ratingCount | Role admin approves listings. ratingAvg and ratingCount are updated when a rating is saved |
| Listing | seller (ref User), title, artist, year, medium, dimensions, condition, description, price, images[], status (pending, live, sold, rejected) | Index on status, medium and price for filtering; text index on title, artist and description |
| Offer | listing (ref), buyer (ref), amount, status (pending, accepted, declined) | One open offer per buyer per listing |
| Order | listing (ref, unique), buyer (ref), seller (ref), price, paid (boolean) | Unique listing prevents selling twice |
| Rating | order (ref, unique), buyer (ref), seller (ref), stars (1 to 5), comment | One rating per order |

**Status transitions**

- Listing: pending, then live (admin approves) or rejected (admin rejects); live, then sold (order paid).
- Offer: pending, then accepted or declined (seller decides). Accepting an offer lets that buyer pay at the offered amount.
- Only live listings appear in browse and search.

## 3. REST API

Base path `/api`. JSON in and out. Access: public, logged in (user), owner, admin.

| Method and path | Access | Purpose |
| --- | --- | --- |
| POST /auth/register | public | Create account, return token |
| POST /auth/login | public | Return token and user |
| GET /auth/me | user | Current user |
| GET /listings | public | Live listings; query: q, medium, minPrice, maxPrice, page |
| GET /listings/:id | public | Listing detail with seller name and rating |
| POST /listings | user | Create listing (multipart with images), status pending |
| PUT /listings/:id | owner | Edit own listing while pending or live |
| DELETE /listings/:id | owner | Delete own listing if not sold |
| GET /listings/mine | user | My listings, any status |
| GET /admin/listings?status=pending | admin | Review queue |
| PATCH /admin/listings/:id | admin | Body: status live or rejected |
| POST /listings/:id/offers | user | Send offer (not on own listing) |
| GET /offers/received | user | Offers on my listings |
| GET /offers/sent | user | Offers I made |
| PATCH /offers/:id | owner of listing | Accept or decline |
| POST /listings/:id/buy | user | Buy now at list price; creates paid order, listing sold |
| POST /offers/:id/pay | offer buyer | Pay an accepted offer at its amount |
| GET /orders/mine | user | My purchases and sales |
| POST /orders/:id/rating | order buyer | Body: stars, comment; updates seller average |

**Rules enforced in the API**

- A seller cannot buy, or offer on, their own listing.
- Only live listings can be bought or receive offers.
- Buying sets the listing to sold and declines its other pending offers; the unique order per listing blocks double sales.
- Only the buyer of a paid order can rate it, once.

**Errors:** a shared JSON shape `{ message }` with status 400 (validation), 401 (no or bad token), 403 (wrong role), 404 and 409 (conflict, for example already sold).

## 4. Frontend

React with function components and hooks. Server data is fetched with Axios in small API modules; auth state lives in a React context (token and user, token kept in localStorage). Styling: plain CSS or a light UI library.

| Route | Page | Access |
| --- | --- | --- |
| / | Home: search bar, filters, grid of listing cards | public |
| /listings/:id | Listing detail: images, info, seller rating, Buy now, Make offer | public |
| /login, /register | Auth forms | public |
| /sell | Create listing form with image upload | user |
| /my/listings | My listings with status badges; edit or delete | user |
| /my/offers | Tabs: offers received (accept or decline), offers sent (pay when accepted) | user |
| /my/orders | Purchases and sales; Rate seller button on purchases | user |
| /admin | Pending listings with approve and reject buttons | admin |

**Shared components:** Navbar, ListingCard, ListingForm, FilterBar, OfferForm, StarRating (input and display), StatusBadge, ProtectedRoute (checks login and role).

**State and UX**

- Loading, empty and error states on every list and form.
- Form validation on the client mirrors the server rules; the server is the source of truth.
- After buy, offer or rating actions, the affected page refetches its data.

## 5. Auth, validation and security

- **Passwords:** hashed with bcrypt; never returned by the API.
- **Tokens:** JWT signed with a secret from the environment, expiry 7 days, sent as `Authorization: Bearer <token>`. An `auth` middleware loads the user; a `requireRole('admin')` middleware guards admin routes.
- **Ownership checks:** controllers compare the document's seller or buyer with the token's user id before changing anything.
- **Validation:** express-validator (or Zod) on every body and query; Mongoose schema validation as a second layer.
- **Uploads:** Multer limits to image types (jpg, png, webp), 5 files and 5 MB each; files get random names.
- **Other:** `helmet`, CORS limited to the frontend origin, rate limit on login, secrets only in `.env`.
- **Demo limits:** no email verification, no password reset, mock payment.

## 6. Project structure, setup and build order

```text
art-market/
  server/
    src/
      config/        db connection, env
      models/        User, Listing, Offer, Order, Rating
      routes/        auth, listings, offers, orders, admin
      controllers/   request handlers and business rules
      middleware/    auth, requireRole, upload, errorHandler
      seed.js        admin user and sample artworks
    uploads/
    .env             MONGO_URI, JWT_SECRET, CLIENT_URL, PORT
  client/
    src/
      api/           axios modules
      context/       AuthContext
      components/
      pages/
```

**Setup:** run MongoDB locally (or Atlas free tier), `npm install` in `server` and `client`, create `.env`, run `npm run seed`, then start both with `npm run dev`.

**Testing (kept light):** Jest and Supertest for the API happy paths (register and login, create and approve a listing, buy, double-buy returns 409, rate once); manual walkthrough of the main flow in the browser.

**Build order**

1. Server skeleton, MongoDB connection, User model, register and login.
2. Listing model, create with images, admin approve, public browse and filters.
3. React app: auth, home grid, detail page, sell form, admin page.
4. Offers: send, accept, decline, pay.
5. Buy now, orders page, seller rating.
6. Seed data, error and empty states, README.
