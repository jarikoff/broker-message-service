FROM node:14-alpine AS dev
WORKDIR /app

COPY ./package-lock.json ./package.json ./

RUN npm install

COPY . .

ARG test="false"
RUN if [ "$test" == "true" ]; then npm run lint && npm run test -- --maxWorkers=1; fi

CMD ["npm", "run", "dev"]


FROM node:14-alpine AS builder
WORKDIR /app

COPY --from=dev /app /app

RUN npm run build



FROM node:14-alpine
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config

RUN chown -R node:node /app
USER node
CMD ["npm", "run", "serve"]
