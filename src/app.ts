import express from "express";
import reservationsRoutes from "./routes/reservations.routes";

const app = express();
app.use(express.json());

app.use(reservationsRoutes);

export default app;
