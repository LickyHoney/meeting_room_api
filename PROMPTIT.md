# PROMPTIT.md

## Prompt 1

**User Prompt:**

I need to implment a project using Typescript and Node.js and I want you to behave like a junior level pair coder.

---

**Assistant Response:**

Perfect 👍
I’ll behave like a junior-level pair coder alongside you.

### How I’ll work with you

* I’ll think out loud, ask reasonable clarifying questions (like a junior would)
* I’ll suggest simple, clean solutions (not over-engineered)
* I’ll sometimes say things like “Not 100% sure, but I think…” and validate with you
* I’ll follow TypeScript + Node.js best practices, but keep things approachable
* I’ll happily implement step by step, refactor when you ask, and learn from your feedback

### Typical things I’ll help with

* Project setup (Node + TypeScript)
* Folder structure
* Writing and explaining TypeScript types
* Basic APIs (Express / Fastify)
* Simple database integration
* Debugging errors together
* Writing small, clear functions
* Adding scripts, linting, and basic tests

### First thing I need from you

To start pairing effectively, can you tell me:

* What kind of project is it? (API, CLI tool, background job, etc.)
* Any framework preference? (Express, Fastify, NestJS, or plain Node?)
* How strict should TypeScript be? (default strict is usually fine)

Once you answer that, I’ll say something like:

“Okay, let’s start by setting up the project structure. I think we should…”
and we’ll build it together step by step 💻✨

---

## Prompt 2

**User Prompt:**

Implement a simple meeting room booking API using Node.js and TypeScript with an in-memory data store.

The API should support the following core features:

* Create a reservation
* Cancel a reservation
* List all reservations for a specific room

The implementation must enforce the following business rules:

* Reservations must not overlap for the same room
* Reservations cannot be created in the past
* The start time must be strictly before the end time

The solution should use an in-memory database (no external persistence) and be structured in a clean, maintainable way.

---

**Assistant Response:**

Alright 👍 I’ll act like a junior pair coder and implement this step by step, keeping things simple and clean, and I’ll explain my thinking as we go.

I’ll assume:

* Node.js + Express
* TypeScript
* In-memory store (arrays / maps)

### 1️⃣ High-level approach (my junior thinking)

“I think we should keep it really simple:

* One Express server
* A reservation model (TypeScript interface)
* A service layer to handle business rules
* Routes that call the service
* That way logic is not stuck inside routes.”

### Features Mapping

```

| Feature                      | HTTP                              |
| ---------------------------- | --------------------------------- |
| Create reservation           | `POST /reservations`              |
| Cancel reservation           | `DELETE /reservations/:id`        |
| List reservations for a room | `GET /rooms/:roomId/reservations` |

```


### 2️⃣ Project structure

```
meeting-room-booking/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── routes/
│   │   └── reservations.routes.ts
│   ├── services/
│   │   └── reservations.service.ts
│   ├── models/
│   │   └── reservation.model.ts
│   ├── store/
│       └── inMemoryStore.ts
│   
├── package.json
├── tsconfig.json

```

### 3️⃣ Reservation model

src/models/reservation.model.ts

```ts
export interface Reservation {
  id: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
}
```

### 4️⃣ In-memory store

“Since it’s in-memory, I think an array is enough.”

src/store/inMemoryStore.ts

```ts
import { Reservation } from "../models/reservation.model";

export const reservations: Reservation[] = [];
```

### 5️⃣ Business logic (important part)

“I’ll put all validations here so routes stay thin.”

src/services/reservations.service.ts

```ts
import { reservations } from "../store/inMemoryStore";
import { Reservation } from "../models/reservation.model";
import { randomUUID } from "crypto";

export class ReservationService {
  static createReservation(
    roomId: string,
    startTime: Date,
    endTime: Date
  ): Reservation {
    const now = new Date();

    // Rule: start must be before end
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    // Rule: cannot create in the past
    if (startTime < now) {
      throw new Error("Reservation cannot start in the past");
    }

    // Rule: no overlapping reservations for same room
    const overlapping = reservations.some(r =>
      r.roomId === roomId &&
      startTime < r.endTime &&
      endTime > r.startTime
    );

    if (overlapping) {
      throw new Error("Reservation overlaps with an existing one");
    }

    const reservation: Reservation = {
      id: randomUUID(),
      roomId,
      startTime,
      endTime
    };

    reservations.push(reservation);
    return reservation;
  }

  static cancelReservation(id: string): void {
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error("Reservation not found");
    }
    reservations.splice(index, 1);
  }

  static listReservationsForRoom(roomId: string): Reservation[] {
    return reservations.filter(r => r.roomId === roomId);
  }
}

```

### 6️⃣ Routes

“Routes should just parse input, call service, and return response.”

src/routes/reservations.routes.ts

```ts

import { Router } from "express";
import { ReservationService } from "../services/reservations.service";

const router = Router();

router.post("/reservations", (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;

    const reservation = ReservationService.createReservation(
      roomId,
      new Date(startTime),
      new Date(endTime)
    );

    res.status(201).json(reservation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/reservations/:id", (req, res) => {
  try {
    ReservationService.cancelReservation(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.get("/rooms/:roomId/reservations", (req, res) => {
  const data = ReservationService.listReservationsForRoom(req.params.roomId);
  res.json(data);
});

export default router;

```

### 7️⃣ Express app & server

src/app.ts

```ts
import express from "express";
import reservationsRoutes from "./routes/reservations.routes";

const app = express();
app.use(express.json());

app.use(reservationsRoutes);

export default app;

```
src/server.ts

```ts
import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


```

### 8️⃣ Example API usage

## Create reservation

```
POST /reservations
Content-Type: application/json

{
  "roomId": "room-1",
  "startTime": "2026-01-20T10:00:00Z",
  "endTime": "2026-01-20T11:00:00Z"
}
```
## List reservations

```
GET /rooms/room-1/reservations
```

## Cancel reservation

```
DELETE /reservations/{id}
```

### 9️⃣ Why this solution is clean (junior justification 😄)

* ✅ Business rules are centralized
* ✅ No external dependencies (pure in-memory)
* ✅ Easy to add persistence later
* ✅ Easy to test service layer separately
* ✅ Simple overlap logic (start < end & end > start)

---

If you want, next we can:

* Add unit tests
* Add request validation
* Improve error handling
* Refactor to NestJS
* Add time-slot availability API

Just tell me what you want to pair on next 👩‍💻👨‍💻

---

*End of prompt documentation*
