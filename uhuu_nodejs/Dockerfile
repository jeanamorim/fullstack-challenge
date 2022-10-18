# Imagem do container
FROM node:17.0.0
# Enviroment variable
ENV WORKDIR=/usr/api/prisma
# Indica qual é o diretório de trabalho
WORKDIR ${WORKDIR}
# Copia todos os arquivos para o workdir
COPY . .

RUN npm install -g nodemon

# CMD ["npm", "start"]