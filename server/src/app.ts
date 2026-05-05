import path from "path";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import session from "express-session";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const requiredEnv = [
  "DATABASE_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const app = express();
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173/opsflow";
const clientOrigin = new URL(clientUrl).origin;
const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:3001/auth/google/callback";

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "opsflow_dev_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: googleCallbackUrl,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { session: false },
      (
        error: Error | null,
        user: Express.User | false,
        info: { message?: string } | undefined
      ) => {
        if (error) {
          console.error("Google authentication error:", error);
          return res.redirect(`${clientUrl}/login?auth=google_error`);
        }

        if (!user) {
          console.warn("Google authentication failed:", info?.message);
          return res.redirect(`${clientUrl}/login?auth=google_failed`);
        }

        return res.redirect(`${clientUrl}/dashboard`);
      }
    )(req, res, next);
  }
);

app.get("/", (_req, res) => {
  res.json({ message: "OpsFlow API is running" });
});

app.get("/tickets", async (_req, res) => {
  const tickets = await prisma.ticket.findMany();
  res.json(tickets);
});

app.get("/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
  });

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }
  res.json(ticket);
});

app.post("/tickets", async (req, res) => {
  const { title, description, priority, assignee, created } = req.body;
  const newTicket = await prisma.ticket.create ({
    data: {
    id: `OPS-${Date.now()}`,
    title, 
    description,
    status: "OPEN",
    priority,
    assignee,
    created
  },
});

  res.status(201).json(newTicket);
  
});

app.put("/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, assignee, created } = req.body;

  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        assignee,
        created,
      },
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket", error);
    res.status(500).json({ message: "Error updating ticket" });
  }
});

app.delete("/tickets/:id", async (req, res) => {
  const {id} =req.params;
  try {
    await prisma.ticket.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting ticket", error);
    res.status(500).json({ message: "Error deleting ticket" });
  }
});

export default app;
