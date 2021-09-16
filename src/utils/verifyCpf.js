module.exports = function (cpf) {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

  if(!cpfRegex.test(cpf)) return false;

  return true;
};