console.log(" Hello from tp ");

const mysql = require("mysql");
const digit = 7;
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tp",
  port: 8889,
});

async function hackPassword(connection) {
  try {
    const password = generatePassword(); // fonction qui generet un password aleatoir selon le nombre de digit dans la variable ici  cest 7
    return await new Promise((res, rej) => {
      console.log(" password ", password);
      connection.query(
        'SELECT * from users WHERE password ="' + password + '"',
        (err, row) => {
          if (err) {
            return rej(err);
          // renvouer le resultas dans un tableau avec le password generer

          }
          return res([row, password]);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
}

forLoop();

async function forLoop() {
  let hacked = false;
  const startTime = new Date().getTime();
  console.log("Start at ", startTime);
  while (hacked === false) {
    await hackPassword(connection).then((data) => {
      if (data[0].length) {
        hacked = true;   // condition d'arret de la boucle while 
        const endTime = new Date().getTime();
        console.log(
          "password was hacked after " + (endTime - startTime) / 1000 / 60
        );
      }
    });
  }
}

function generatePassword() {
  const randPassword = Array(digit)
    .fill("abcdefghijklmnopqrstuvwxyz")
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join("");
  return randPassword;
}
