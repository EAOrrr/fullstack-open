import { useState, useEffect } from 'react'
import axios from 'axios'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import PropTypes from 'prop-types';
const api_key = import.meta.env.VITE_SOME_KEY
const base_url = 'https://api.openweathermap.org/data/2.5/weather?'
// variable api_key now has the value set in startup

const WeatherView = ({country, weather}) => {
  console.log('weatherview', country, weather)
  if (weather){
    console.log(`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`)
    return (
      <div>
        <h2>Weather in {country.capital}</h2>
        <p> temperature {weather.main.temp} Celcius</p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather.description}/>
        <p>wind {weather.wind.speed} m/s</p>
      </div>
    )
  }
  
  
}

const CountryView = ({country}) => (
  <div>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
      
        <h3>languages</h3>
        <ul>
          {Object.entries(country.languages)
            .map(k_v_pair => <li key={k_v_pair[0]}>{k_v_pair[1]}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt}/>
    </div>
)

CountryView.propTypes = {
  country: PropTypes.object.isRequired,
};

const PrintCounties = ({ countries, weather, toggleShowOf }) => {
  console.log('printCountries', countries, weather)
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  if (countries.length > 1) {
    // console.log(show)
    return countries.map(c => 
    <div key={c.name.common}>
      <p>{c.name.common}
      <button onClick={()=>toggleShowOf(c.name.common)}>
        {c.show? 'hide':'show'}
      </button>
    </p>
    {c.show? <CountryView country={c}/>: <></>}
    </div>
    )
  }
  if (countries.length == 0) {
    return <p>No matches</p>;
  }

  return (
    <div>
    <CountryView country={countries[0]}></CountryView>
    <WeatherView country={countries[0]} weather={weather}></WeatherView>
    </div>
  )
}

PrintCounties.propTypes = {
  countries: PropTypes.array.isRequired,
  toggleShowOf: PropTypes.func.isRequired
};

function App() {
  const [country, setCountry] = useState('')
  const [countriesList, setCountriesList] = useState([])
  const [weather, setWeather] = useState(null)

  const toggleShowOf = name => {
    console.log('toggle show of', name);
    setCountriesList(countriesList
      .map(c =>
         c.name.common === name? {...c, show: !c.show}: c))
    console.log('countriesList after changed: ', countriesList)
  }

  useEffect(() => {
    console.log('effect run, country is now', country)
    console.log('fetching countries data')
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      // console.log(response.data)
      // const countries = response.data.map(c => c.name.common)
      const newCountriesList = response.data
        .filter(c => c.name.common.toLowerCase().includes(country.toLowerCase()))
        .map(c => ({...c, show: false}))
      setCountriesList(newCountriesList)
     
      console.log('after get and filter:', countriesList)
    })
    
  }, [country])

  useEffect(() => {
    console.log('effect run, countriesList is now', countriesList)
     if (countriesList.length === 1) {
        console.log('fetching weather data')
        const lat = countriesList[0].latlng[0]
        const lon = countriesList[0].latlng[1]
        axios
        .get(`${base_url}lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
        .then(response => {
          console.log('promise fulfilled')
          setWeather(response.data)
          console.log(response.data)
        })
      }
    else{
      setWeather(null)
    }
  }, [countriesList])
  console.log('countriesList:',countriesList)
  console.log('weather:', weather)
  
  return (
    <div>
      <p>find countries
      <input value={country} onChange={event => setCountry(event.target.value)} />
      </p>
      <PrintCounties countries={countriesList} weather={weather} toggleShowOf={toggleShowOf}/>
      
    </div>
  )
}

export default App
