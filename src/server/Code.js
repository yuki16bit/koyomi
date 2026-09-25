function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('Koyomi');
}

function helloGws() {
  const message = 'Hello gws';
  console.log(message);
  return message;
}
