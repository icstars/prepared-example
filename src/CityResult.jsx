function CityResult({name, country, population}) {

    return (
        <div className="city-result">
            <h2>{name}</h2>
            <p>{country} - Population: {population}</p>
        </div>
    )
}

export default CityResult;