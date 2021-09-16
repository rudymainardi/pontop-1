module.exports = function (cnpj) {
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;

  if(!cnpjRegex.test(cnpj)) return false;

  return true;
};