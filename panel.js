const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

async function startApplication() {
  console.log("Salut👋 !!! Vous êtes sur le point de déployer DARK--MD sur le panel. Incroyable n'est ce pas chanceux !");

  // Vérifier si le fichier set.env existe
  const envFilePath = path.join(__dirname, "set.env");
  if (!fs.existsSync(envFilePath)) {
    console.log("Le fichier set.env n'a pas été trouvé. Veuillez créer le fichier et y ajouter vos variables.");
    return;
  }

  // Lire le fichier set.env pour voir si la SESSION est la...
  const envFileContent = fs.readFileSync(envFilePath, "utf-8");
  const envVariables = envFileContent.split("\n").reduce((acc, line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});

  // Vérifier la valeur de SESSION_ID
  if (envVariables.SESSION_ID === "zokk") {
    console.log("Veuillez mettre votre SESSION_ID dans le fichier set.env.");
    return;
  }

  // Démarrer l'application avec PM2
  const childProcess = exec("npx pm2 start index.js --attach");

  childProcess.stdout.on("data", data => {
    console.log(data);
  });

  childProcess.stderr.on("data", error => {
    console.error(error);
  });

  childProcess.on("close", code => {
    console.log(`Processus stoppe avec le code : ${code}`);
  });
}

// Démarrer l'application et gérer les erreurs
startApplication().catch(console.error);