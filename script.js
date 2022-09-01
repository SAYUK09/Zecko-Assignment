const spreadsheetId = "1pQnWNDfzV1m4OrDFhslVoGdeN_Xm5Mu_gFAN9GE13Pk";
const DISCOVERY_DOC =
  "https://sheets.googleapis.com/$discovery/rest?version=v4";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById("authorize_button").style.visibility = "hidden";
document.getElementById("signout_button").style.visibility = "hidden";

async function getApiKey() {
  const res = await fetch("/config.json");
  const data = await res.json();
  const API_KEY = data.API_KEY;

  return API_KEY;
}

async function getClientId() {
  const res = await fetch("/config.json");
  const data = await res.json();
  const CLIENT_ID = data.CLIENT_ID;

  return CLIENT_ID;
}

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client", intializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function intializeGapiClient() {
  await gapi.client.init({
    apiKey: await getApiKey(),
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
async function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: await getClientId(),
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").style.visibility = "visible";
  }
}

function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
    await listMajors();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    document.getElementById("content").innerText = "";
    document.getElementById("authorize_button").innerText = "Authorize";
    document.getElementById("signout_button").style.visibility = "hidden";
  }
}

async function listMajors() {
  let response;
  console.log("tral");
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "A:A",
    });

    const data = JSON.parse(response.body);

    analyze(data.values);
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

async function analyze(data) {
  const values = data.map((website) => {
    if (website.toString().toLowerCase() === "website".toLowerCase()) {
      console.log("tata");
      return "Category";
    } else {
      return "baka";
    }
  });

  return values;
}
