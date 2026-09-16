# Hotel Management & Booking System

Final Degree Project (TFG) for the Web Application Development (DAW) program — a full-stack platform for managing hotels, room bookings, and offers, including payment processing and automated email notifications.


## Overview

A hotel management and booking platform built from the ground up as a free-choice final degree project. It covers the core operations a hotel business needs: managing properties, handling reservations, processing payments, and keeping users informed via email — all behind a role-based access system.

## Key Features

- **Role-based access control** — three roles (User, Admin, Owner), each with different permissions: owners manage their own hotels, admins oversee the platform, and users browse and book.
- **Hotel & room management** — CRUD for hotels, room types, and categories.
- **Offers system** — owners can create promotional offers tied to their hotels/rooms.
- **Reservation system** — end-to-end booking flow, from availability to confirmation.
- **Payment processing** — integrated with **Stripe** for secure online payments.
- **Refund system** — a custom refund flow built on top of Stripe's API. Implementing this correctly was one of the harder technical challenges of the project, since Stripe's refund model doesn't map cleanly to a hotel's real-world refund logic; a production system with a payment provider tailored to the hospitality industry would likely simplify this considerably.
- **Automated email notifications** — booking confirmations and updates sent via **Mailtrap**.

## Tech Stack

**Back-end:** PHP, Laravel
**Front-end:** React
**Styling:** Tailwind CSS, DaisyUI
**Database:** PostgreSQL
**Payments:** Stripe API
**Email:** Mailtrap
**Deployment:** Docker

## Status
This project was developed under a limited timeframe as part of the DAW final degree project requirements. Core functionality (hotel/room management, roles, reservations, payments, refunds, email notifications) is complete and working; some areas — particularly UI polish — could still be refined further.

## Author

**Álvaro Vidal** — Web App Development (DAW) student
[GitHub](https://github.com/alvarodawserver) · [LinkedIn](#)
