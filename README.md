# Proof Protocol

## Getting Started

Install dependencies
```
npm i
```

Create `.env` following `.env.example`

Start `ngrok` and `postgres`
```
docker compose up -d
```

Migrate the prisma schema
```
npx prisma migrate dev --name --init
```

Start the application
```
npm run dev
```
