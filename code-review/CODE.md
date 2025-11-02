```typescript
import express from "express";
import crypto from "crypto";
import { Pool } from "pg";

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const hash = crypto.createHash("md5").update(password).digest("hex");
    const sql = `SELECT * FROM users WHERE email='${email}' AND
password='${hash}'`;
    const result = await pool.query(sql);
    if (result.rows.length) {
        const token = Buffer.from(email + ":" + Date.now()).toString("base64");
        (global as any).SESSIONS = (global as any).SESSIONS || {};
        (global as any).SESSIONS[token] = { email };
        res.json({ token });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

router.post("/invite", async (req, res) => {
    const pw = Math.random().toString(36).slice(2);
    const hash = crypto.createHash("md5").update(pw).digest("hex");
    const q = await pool.query(`INSERT INTO users(email,password,role)
VALUES('${req.body.email}','${hash}','admin')`);
    res.json({ ok: true, tempPassword: pw });
});

export default router;
```