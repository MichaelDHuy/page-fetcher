const request = require('request');
const fs = require('fs');
const readline = require('readline');

const url = process.argv.slice(2, 3).toString();
const path = process.argv.slice(3, 4).toString();
const writeFile = function() {
  let filesBytes = fs.statSync(path);
  console.log(`Downloaded and saved ${filesBytes.size} bytes to ./${path}. `); // calculate file size
};

const rl = readline.createInterface({ //readline
  input: process.stdin,
  output: process.stdout
});

request(url, (error, response, body) => {
  const checkExists = function(err) { //check if the file exists or not
    if (!err) {  // no error and file not exists
      writeFile();
      rl.close(); //process ends
    }
    else { //file exists we ask user to overwrite
      console.log('File exists...');
      if (err.code === "EEXIST") { // file already exist
        rl.question("File already exists. Do you want to overwrite ([y]es/[n]o):", (answer) => {
          if (answer === "Y" || answer === "y") { 
            fs.writeFile(`${path}`, `${body}`, confirmation); //if yes, file will be written
          }
          else if (answer === "N" || answer === 'n') { //if no, file cannot be savd
            console.log(`${path} cannot be saved`);
          }
          else {
            console.log("Invalid input");
          }
      rl.close();
      });
    } else
    throw err;
  }
};
if (!error) { // back to the first step of request
  console.log('Downloading...');
  fs.writeFile(`./${path}`, `${body}`, checkExists);
}
else {
  console.log("error: ", error);
}
});
