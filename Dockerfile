# Utiliser une image de base Node.js pour construire l'application
FROM node:16

# Créer un répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install 

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port 3000 sur lequel l'application écoute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
