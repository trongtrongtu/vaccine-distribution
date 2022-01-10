
async function listVacine(params) {
  try {
    let response = await fetch('http://localhost:3001/api/help', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

async function getRateVaccine(value) {
  try {
    let response = await fetch('http://localhost:3001/api');
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

async function getRiskClassification(value) {
  try {
    let response = await fetch('http://localhost:3001/api/risk-classification');
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

async function listAddRiskClassification(params) {
  try {
    let response = await fetch('http://localhost:3001/api/risk-classification', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(`Error is : ${error}`);
  }
}

export { listVacine, getRateVaccine, getRiskClassification, listAddRiskClassification };