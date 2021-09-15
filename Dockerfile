FROM node
RUN mkdir /src
COPY package-lock.json package.json .
RUN npm install
COPY prisma/ ./prisma
RUN npx prisma generate
COPY README.md next-env.d.ts tsconfig.json app.js .
COPY components/ ./components
COPY pages/ ./pages
COPY public/ ./public
COPY typings-custom/ ./typings-custom
COPY lib/ ./lib
COPY styles/ ./styles
COPY types/ ./types
CMD npm run bootstrap && npm run dev
