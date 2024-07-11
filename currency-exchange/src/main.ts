interface Data {
  conversion_rates: Record<string, number>;
}

class FetchWrapper {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  get(endpoint: string): Promise<Data> {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }

  put(endpoint: string, body: any): Promise<any> {
    return this._send('put', endpoint, body);
  }

  post(endpoint: string, body: any): Promise<any> {
    return this._send('post', endpoint, body);
  }

  delete(endpoint: string, body: any): Promise<any> {
    return this._send('delete', endpoint, body);
  }

  _send(method: string, endpoint: string, body: any): Promise<any> {
    return fetch(this.baseURL + endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
}

// The goal of this project is to show the user the conversion rate between 2 currency pairs.
// The currency chosen on the left is the base currency and the currency chosen on the right is the target currency.
// The app starts at 1 USD = 1 USD.

const apiKey = '1e5a6f772db027888f41dc58';
const baseCurrencySelect = document.getElementById('base-currency') as HTMLSelectElement;
const targetCurrencySelect = document.getElementById('target-currency') as HTMLSelectElement;
const conversionResult = document.getElementById('conversion-result') as HTMLParagraphElement;

const api = new FetchWrapper(`https://v6.exchangerate-api.com/v6/${apiKey}/`);

// A global variable that stores the conversion rates for each currency pair as an array of arrays
let rates: Record<string, number> = {};

// A call to the get method of the API instance with the endpoint that requests the latest conversion rates for the USD currency
const getConversionRates = () => {
  const baseCurrency = baseCurrencySelect.value;
  api.get(`latest/${baseCurrency}`).then(data => {
    rates = data.conversion_rates;
    updateConversionResult();
  });
};

// A function that performs the currency conversion and updates the UI
const updateConversionResult = () => {
  const targetCurrency = targetCurrencySelect.value;
  const conversionRate = rates[targetCurrency];
  conversionResult.textContent = conversionRate.toFixed(4);
};

// Add event listeners to the base and target elements that invoke the getConversionRates and updateConversionResult functions when the user selects a new value
baseCurrencySelect.addEventListener('change', getConversionRates);
targetCurrencySelect.addEventListener('change', updateConversionResult);

// Initial fetch for default base currency (USD)
getConversionRates();
