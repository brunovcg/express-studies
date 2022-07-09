import express from "express";
import { validate } from "../middleware/validade";
import { logRequestInConsole } from "../middleware/consolelog";
import * as yup from "yup";
import * as bcrypt from "bcryptjs";
const router = express.Router();
import jwt from "jsonwebtoken";
import { authenticateUser } from "../middleware/authenticate";

const addressSchema = yup.object().shape({
  email: yup.string().email().required(),
  fullName: yup.string().required(),
  timestamp: yup.date().default(() => new Date()),
});

router.post("/address", validate(addressSchema), (req, res) => {
  res.status(201).json({ message: "deu bom" });
});

router.get("/", (req, res) => {
  // bellow cabeçalho pode ser opcional
  res.set("Content-Type", "text/plain");
  res.json({ message: "iai boy" });
});

router.get("/user/:id", logRequestInConsole, (req, res) => {
  const params = req.params;
  res.status(200).json({ message: `seu codigo ${params.id}` });
});

router.get("/resources", (req, res) => {
  const query = req.query;

  res.status(200).json(query);
});

router.post("/bodyinfo", (req, res) => {
  const data = req.body;
  console.log(data);
  res.status(201).json(data);
});

router.post("/", (req, res) => {
  /*  res.statusCode = 201;
   res.json({message: "Resource created!"});
     OU
*/
  res.status(201).send("Hello World!");
});

// Chamando a função do router que vai escutar requisições em uma determinada porta

// ! simulando um LOGIN UI

const config = {
  secret: "my_random_secret_key",
  expiresIn: "60",
};

const users = [];

router.post("/users", (req, res) => {
  users.push(req.body);
  res.status(201).json(req.body);
});

// Rota para listar usuários.
router.get("/users", logRequestInConsole, (req, res) => {
  res.json(users);
});

router.post("/login", (req, res) => {
  // Descontruímos o body para obter os dados de login.
  let { username, password } = req.body;

  // Utilizando o username, buscamos algum item no array que satisfaça
  // a condição de igualdade.
  let user = users.find((user) => user.username === username);

  // Validamos se o usuário foi encontrado e se a senha confere com
  // a encontrada.
  if (!user) {
    return res.status(401).json({ message: "User not found." });
  } else if (user.password != password) {
    res.status(401).json({ message: "User and password missmatch." });
  }

  // Geramos o token com o username como identificador, passando o token,
  // a chave para decodificar e o tempo para expirar.
  let token = jwt.sign({ username: username }, config.secret, {
    expiresIn: config.expiresIn,
  });

  // Retornamos com código 200 o token.
  res.json({ token });
});

// Rota para retornar o CPF do usuário logado somente para fim didatico.
router.get("/whoami", (req, res) => {
  // Acessando o cabeçalho authorization da requisicao.
  // Como o token vem composto do Prefixo Bearer, vamos fazer um split
  // e ficar com a segunda parte da string
  let token = req.headers.authorization.split(" ")[1];

  // Usando o metodo verify para decodificar o token e obter os dados
  // contidos nele.
  // Passamos uma função de callback para retornar o cpf do usuario caso
  // o token seja válido.
  jwt.verify(token, config.secret, (err, decoded) => {
    // Tratativa caso o token nao seja válido.
    if (err) {
      return res.status(401).json({ message: "Invalid Token." });
    }

    // Retorna o cpf como JSON.
    // const cpf = users.cpf;
    return res.json({ olha: "teste" });
  });
});

router.delete("/users", authenticateUser(users), (req, res) => {
  // Acessando o usuário que foi adicionado pelo MW no objeto req.
  const { user } = req;

  // Deletando o usuario logado do array.
  users.splice(user, 1);

  return res.status(204).send();
});

// ! Encriptação

const cars = [];

router.post("/signupsecure", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const data = {
      username: req.body.username,
      password: hashedPassword,
    };
    cars.push(data);

    const { password: data_password, ...dataWithoutPassword } = data;

    return res.status(201).json(dataWithoutPassword);
  } catch (e) {
    res.json({ message: "Error while creating an user" });
  }
});

const config2 = {
  secret: "secret_key",
  expiresIn: "1h",
};

router.post("/loginsecure", async (req, res) => {
  // Descontruímos o body para obter os dados de login.
  let { username, password } = req.body;

  const user = await cars.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ message: "deu ruim boy" });
  }
  try {
    //Ira retornar true/false
    const match = await bcrypt.compare(password, user.password);
    let token = jwt.sign(
      { username: username, uuid: user.uuid },
      config2.secret,
      { expiresIn: config2.expiresIn }
    );
    if (match) {
      res.json({ accessToken: token });
    } else {
      res.json({ message: "Invalid Credentials" });
    }
  } catch (e) {
    console.log(e);
  }
});

export default router;
