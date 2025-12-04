# Multi-stage Dockerfile
# Stage 1: build frontend
FROM node:18-bullseye AS build
WORKDIR /app

# copy and install frontend deps
COPY Frontend/package*.json Frontend/
RUN cd Frontend && npm ci --silent

# copy frontend sources and build
COPY Frontend/ Frontend/
RUN cd Frontend && npm run build

# Stage 2: production image
FROM node:18-bullseye
WORKDIR /app

# install backend deps (production)
COPY Backend/package*.json Backend/
RUN cd Backend && npm ci --production --silent

# copy backend source
COPY Backend/ Backend/

# copy built frontend into the image so backend can serve it
COPY --from=build /app/Frontend/dist /app/Frontend/dist

ENV NODE_ENV=production
EXPOSE 5000

# Start the backend (it will serve the built frontend from Frontend/dist)
CMD ["node", "Backend/index.js"]
