# PRD: Artwork Secondary Market App

Date: 2026-10-23

## 1. Overview

A demo app where owners of artworks (paintings, sculptures, prints) can list a piece for resale and buyers can browse and buy it. The goal is to show the core resale flow end to end, not to build a production marketplace.

**Problem.** Owners who want to resell art have few simple options: auction houses are selective and slow, and general marketplaces have no art-specific details.

**Users.** Sellers (owners of an artwork) and buyers (collectors). An admin approves listings.

## 2. Scope

**In scope**

- Sign up and log in
- Create and manage listings with photos and details
- Browse, search and filter listings
- Make an offer or buy now
- Admin approval of listings
- Buyers rate sellers (1 to 5 stars) after a purchase

**Out of scope (demo)**

- Messaging between users
- Delivery and shipment tracking
- Real payments, escrow, identity checks and authentication services
- Disputes, notifications, multiple languages

## 3. User stories

- As a seller, I create a listing with photos, artist, medium, dimensions, year, condition and price.
- As a buyer, I browse and filter listings by artist, medium and price.
- As a buyer, I open a listing and either buy it or make an offer.
- As a seller, I accept or decline offers on my listings.
- As an admin, I approve or reject new listings.
- As a buyer, after buying, I rate the seller from 1 to 5 stars and see each seller's average rating on their listings.

## 4. Features

| ID | Feature | Details |
| --- | --- | --- |
| F1 | Accounts | Email and password; role is buyer or seller (one user can be both) |
| F2 | Create listing | Photos, title, artist, year, medium, dimensions, condition, price, description |
| F3 | Admin review | Admin sees pending listings and approves or rejects them |
| F4 | Browse and search | List and detail pages; search by keyword; filter by medium and price |
| F5 | Offers | Buyer sends an offer; seller accepts or declines |
| F6 | Buy now | Simulated payment; listing is marked sold |
| F7 | My account | My listings, my offers, my purchases |
| F8 | Seller rating | After a purchase the buyer gives 1 to 5 stars (one rating per order); the seller's average is shown on listings and profile |

## 5. Main flow

1. Seller creates a listing, status is pending.
2. Admin approves it, status becomes live.
3. Buyer finds it and either clicks Buy now or sends an offer.
4. If an offer is accepted, the buyer completes the (simulated) payment.
5. The listing is marked sold and appears in both users' accounts.
6. The buyer rates the seller.

## 6. Data model

| Entity | Key fields |
| --- | --- |
| User | name, email, password hash, role |
| Listing | seller, title, artist, year, medium, dimensions, condition, price, images, status (pending, live, sold) |
| Offer | listing, buyer, amount, status (pending, accepted, declined) |
| Order | listing, buyer, price, date |
| Rating | order, buyer, seller, stars (1 to 5), optional comment |

## 7. Suggested tech

- Web app (React or similar) with a simple REST API
- Relational database (SQLite or PostgreSQL)
- Local file storage for images
- Payment is a mock button, no external provider

## 8. Open questions

- [ ] Web only, or mobile too?
- [ ] Is the admin role needed in the demo, or are listings auto-approved?
- [ ] Sample data: how many seeded artworks?
