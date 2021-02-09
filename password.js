console.log(" Hello from tp ");

// get mysql npm package
const mysql = require("mysql");
// digit = nombre de caracter a generer 
const digit = 7;
// connexion a la db
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tp",
  port: 8889,
});

// calculer le nombre de possiblites pour 7 caracteres du mot de passe 26 puissance 7 = 8031810175 possiblite
const numberOfPossibilities = Math.pow(26, digit) - 1; 

function possibilityToString(possibility) {
  var string = "";
  while (string.length < digit) {
   // generer le premier character du password qui egqle a  'a' avec le code ascii et faire une incrementation des carecter suivant pour generere le password avec 7 digit 
   // en commançant de aaaaaaa jusqu a zzzzzzz sselon la valeur de la variable digit (dans ce cas c est 7)
    string = String.fromCharCode(97 + (possibility % 26)) + string;
    possibility = Math.floor(possibility / 26);
  }
  return string;
}


async function hackPassword(connection, password) {
  try {
    // faire une requette a la db et attandre la reponse asynchrone
    return await new Promise((res, rej) => {
      console.log(" new generated password ", password);
      connection.query(
        'SELECT * from users WHERE password ="' + password + '"',
        (err, row) => {
          if (err) {
            return rej(err);
          }
          // renvouer le resultas dans un tableau avec le password generer
          return res([row, password]);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
}

async function processPossibilities(numberOfPossibilities) {
  const startTime = new Date().getTime(); // calculer la date de debut du programe en ms
  console.log("Start at ", startTime);
  for (var n = 0; n <= numberOfPossibilities; n++) { // boucler sur le nombdre de posibilite
    let password = possibilityToString(n); //generer le password selon la position de la posiibilite
    await hackPassword(connection, password).then((data) => {
      // attandre la reponse de la Promise 
      if (data[0].length) { // tester si la premier case du tableau n pas vide --> on a recuperer un resultas qui corespand au mot de passe
        const endTime = new Date().getTime(); // calculer la date de fin du programe en ms
        console.log(
          "password was hacked after " + (endTime - startTime) / 1000 / 60
        );
        n = numberOfPossibilities; //condtion d arret de la boucl for quand on trouve le password 
        connection.end(); // fermeture de la connection a la db 
      }
    });
  }
}

processPossibilities(numberOfPossibilities);
