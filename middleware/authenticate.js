import jwt from "jsonwebtoken";
const config = {
  secret: "my_random_secret_key",
  expiresIn: "60",
};

export const authenticateUser = (users) => (req, res, next) => {
  // O código a seguir é retirado de dentro do escopo da rota para
  // reaproveitarmos em outras possíveis rotas.

  let token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token." });
    }

    // Repare na última variável, vinda do JWT decodificado.
    let user = users.find((user) => user.username === decoded.username);

    // Adicionamos o usuário ao request, assim todos os requests
    // que utilizem esse MW terão acesso ao usuário.
    req.user = user;
  });

  // Para continuar o fluxo do padrão MW.
  return next();
};
