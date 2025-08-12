## 1) Initialize projects

```bash
# clone your repo dir
mkdir -p sri-lakshmi-printers && cd sri-lakshmi-printers

# frontend
npx create-react-app frontend --use-npm
cd frontend
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# replace generated files with those in this repo (src/, public/, configs)
cd ..

# backend
mkdir backend && cd backend
npm init -y
npm i express mongoose cors dotenv express-validator
npm i -D nodemon
# add files from this repo (server.js, src/**)
cp .env.example .env   # edit values
```



cd backend
npm run dev



