import {useState, useEffect} from 'react';

import './App.css'

import CityResult from './CityResult';

function App() {

  const [cityComponentArray, setCityComponentArray] = useState([]);

  const [cityData, setCityData] = useState([]);

  // for now - get ALL cities and display them
  useEffect(
    () => {
      function getCities() {

        // let newCityResults = [];
        // for (var i = 0; i < cityData.length; i++) {
        //   console.log(cityData[i]);
        //   let newComponent = <CityResult 
        //     name={cityData[i].Name}
        //     country={cityData[i].CountryCode}
        //     population={cityData[i].Population}
        //   />
        //   newCityResults.push(newComponent);
        // }
        let newCityResults = cityData.map(c => <CityResult key={c.ID} name={c.Name} country={c.Country} population={c.Population}/>
        )
        setCityComponentArray(newCityResults);
      }
      getCities();
    }, [cityData] // dependencies for UseEffect
  )

  async function submitPopulationRequest(formData) {
    //  get the cities with the specific population from the database

    let citiesFromDatabase = await getCitiesInPopulationRange(formData);

    // update the list of cities in the app with that information
    setCityData(citiesFromDatabase);
  }

  async function getCitiesInPopulationRange(formData) {
    // actually making call to backend server
    let response = await fetch('http://localhost:3000/cities_in_population_range', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {'min': formData.get("populationMinimum"), 'max': formData.get("populationMaximum")}
      )

    });
    // wait for promise to resolve and become json
    let cities = await response.json();
    console.log(cities);
    return cities;
  }

  return (
    <>
      <h1>World Cities</h1>
      <form id="populationInputForm" action={submitPopulationRequest}>
        <p>Select the minimum and maximum populations to show:</p>
        <input type='number' name='populationMinimum'/> to <input type='number' name='populationMaximum'/>
        <input type='submit'/>
      </form>
      <div className="city-display">
        {cityComponentArray}
      </div>
    </>
  )
}

export default App;
