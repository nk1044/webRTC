1. setup package.json
```bash
npm init -y
```

2. install express
```bash
npm i express
```

3. Install Required Dependencies
```bash
npm install -D typescript ts-node @types/node @types/express nodemon
```

4. Initialize TypeScript
```bash
npx tsc --init
```

5. Add `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

6. Add `nodemon.json`
```json
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["node_modules"],
  "exec": "node --loader ts-node/esm src/index.ts"
}
```

7. Update `Package.json`
```json
"scripts": {
    "start": "nodemon",
    "build": "tsc -b"
  },
```