FROM node
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
USER node
WORKDIR /home/node/app
COPY --chown=node:node package-lock.json package.json ./
RUN npm install
COPY --chown=node:node prisma/ ./prisma
RUN npx prisma generate
COPY --chown=node:node README.md next-env.d.ts tsconfig.json app.js ./
COPY --chown=node:node components/ ./components
COPY --chown=node:node pages/ ./pages
COPY --chown=node:node public/ ./public
COPY --chown=node:node typings-custom/ ./typings-custom
COPY --chown=node:node lib/ ./lib
COPY --chown=node:node styles/ ./styles
COPY --chown=node:node types/ ./types
EXPOSE 3000
CMD npm run bootstrap && npm run dev
