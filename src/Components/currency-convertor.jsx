import { useEffect } from "react";
import { useState } from "react";
import { HiArrowsRightLeft } from "react-icons/hi2";
import CurrencyDropdown from "./dropdown";

const CurrencyConvertor = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || ["INR", "EUR"]);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);

  // https://api.frankfurter.app/currencies

  const fetchCurrencies = async () => {
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();
      setCurrencies(Object.keys(data));
    } catch (e) {
      console.error("Error Fetching ", e);
    }
  };

   // https://api.frankfurter.app/latest?amount=1&from=USD&to=INR
   const convertCurrency = async () => {
    if (!amount) return 
    setConverting(true)
    try{
       const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
       const data = await res.json();
       setConvertedAmount(data.rates[toCurrency] + " " + toCurrency)
    }catch(error){
        console.error("Error Fetching", error);
    }finally{setConverting(false)}
   };

  // When ever our components loads
  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleFavorite = (currency) => {
      let updatedFavorites = [...favorites]
      if (favorites.includes(currency)){
        updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
      }else{
        updatedFavorites.push(currency);
      }
      setFavorites(updatedFavorites)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  };

  const swapCurrencies = () => {
    const from = fromCurrency;
    const to = toCurrency;
    setFromCurrency(to);
    setToCurrency(from);

  }


  return (
    <div className="max-w-xl m-auto my-10 p-5 bg-white rounded-lg shadow-md">
      <h1 className="mb-5 text-2xl font-semibold text-gray-700">
        Currency Convertor
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <CurrencyDropdown
          favorites = {favorites}
          currencies={currencies}
          title="From"
          currency = {fromCurrency}
          setCurrency = {setFromCurrency}
          handleFavorite={handleFavorite}
        />
        {/* swap currency */}
        <div className="flex justify-center -mb-5 sm:mb-0">
          <button onClick={swapCurrencies} className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
            <HiArrowsRightLeft className="text-xl text-gray-700"/>
          </button>
        </div>

        <CurrencyDropdown
          favorites = {favorites}
          currencies={currencies}
          title="To"
          currency = {toCurrency}
          setCurrency = {setToCurrency}
          handleFavorite={handleFavorite}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700">
          Amount:
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
          type="number"
          min={0}
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={convertCurrency}
          className={`px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${converting ? "animate-pulse" : ""}`}>
          Convert
        </button>
      </div>

      {convertedAmount && <div className="mt-4 text-lg font-medium text-right text-green-600">
        Converted Amount : {convertedAmount}
      </div>}
    </div>
  );
};

export default CurrencyConvertor;
