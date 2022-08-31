const API_KEY = "AIzaSyBUtLChhGPGARgiohFzb7vSGExjmc1EKHs";
const DISCOVERY_DOC =
  "https://sheets.googleapis.com/$discovery/rest?version=v4";

(async () => {
  fetch("https://apis.google.com/js/api.js").then(() => console.log("akakak"));
})();

document.getElementById("initBtn").addEventListener("click", () => {
  gapi.load("client", intializeGapiClient);
});

async function intializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });

  listMajors();
}

async function listMajors() {
  let response;
  console.log("tral");
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1pQnWNDfzV1m4OrDFhslVoGdeN_Xm5Mu_gFAN9GE13Pk",
      range: "A1",
    });

    console.log(response, "ress");
  } catch (err) {
    console.log("err", err);
    document.getElementById("content").innerText = err.message;
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    document.getElementById("content").innerText = "No values found.";
    return;
  }
}
