const app = require("./config/express")();
const port = app.get("port");
const fetch = require("node-fetch");
const fs = require("fs");
const crypto = require("crypto");
const consts = require("./config/constants");

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(consts);

  getData(consts.url, consts.search, consts.token).then((resp) => {
    messageCipher(consts.decodeURL, resp.cifrado, resp.numero_casas).then(
      (data) => {
        try {
          console.log("RESPONSE:", data.response);

          resp.decifrado = data.response;

          resp.resumo_criptografico = getHash(resp.decifrado);

          let content = JSON.stringify(resp);
          saveOnFile("api/data/answer.json", content);
        } catch (err) {
          console.log("Aconteceu algum erro ");
        }
      }
    );
  });
});

const getData = async (url, search, token) => {
  try {
    const response = await fetch(url + search + token);
    const json = await response.json();
    console.log("json: ", json);

    return json;
  } catch (err) {
    console.log(`ERRO ao buscar dados da API(${url}): ${err}`);
  }
};

const submit = async (url, search, token) => {
  let formData = {
    answer: {
      value: fs.createReadStream("api/data/answer.json"),
      options: {
        filename: "answer.json",
        contentType: null,
      },
    },
  };
  console.log(formData);

  try {
    const response = await fetch(url + search + token, {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const json = await response.json();
    return json;
  } catch (err) {
    console.log(`ERRO ao enviar dados para API(${url}): ${err}`);
  }
};

const messageCipher = async (url, message, changeFactor) => {
  let body = { message, changeFactor };
  console.log("BODY: ", body);

  try {
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();

    return json;
  } catch (err) {
    console.log(`ERRO ao buscar dados da API(${url}): ${err}`);
  }
};

const saveOnFile = (fileName, content) => {
  fs.writeFile(fileName, content, "utf8", function (err) {
    if (err) throw err;

    console.log("Informação do JSON salvo com sucesso");
  });
};

const readFromFile = (fileName, callback) => {
  fs.readFile(fileName, (err, data) => {
    if (err) throw err;
    let dataAsJson = JSON.parse(data);
    callback(dataAsJson);
  });
};

const getHash = (data) => {
  let hash = crypto.createHash("sha1");
  data = hash.update(data, "utf-8");
  generatedHash = data.digest("hex");
  console.log("hash : " + generatedHash);
  return generatedHash;
};
