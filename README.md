## 01 Project
developing phase

## 02 Socket-videocall
you can access the website here:- [website](https://test-video-call-nine.vercel.app/)

- ***socket.io*** for signalling server
- ***webrtc*** for p2p connection


### steps to setup a npm library

```bash
npm init -y
```

```bash
npm install --save-dev typescript tsup ts-node eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier

```
```bash
npx tsc --init

```
tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "declaration": true,
    "declarationDir": "./dist",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}

```

package.json
```json

"main": "dist/index.js",
"module": "dist/index.mjs",
"types": "dist/index.d.ts",
"exports": {
".": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.js",
    "types": "./dist/index.d.ts"
}
},
"scripts": {
"build": "tsup src/index.ts --format esm,cjs --dts",
"dev": "tsup src/index.ts --format esm,cjs --watch",
"prepublishOnly": "npm run build"
},

```
- create src/index.ts