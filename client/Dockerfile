FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci --no-audit --no-fund

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
