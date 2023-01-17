import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Loader from "../components/Loader"
import { FaAngleDoubleLeft } from "react-icons/fa"
import {
  fetchCities,
  fetchCity,
  generateTravelStep,
  saveTravelStepCriteria,
} from "../stores/actions/actionCreator"
import { yellowButton } from "../helpers/buttonStyle"
import { NumericFormat } from 'react-number-format';

export default function TravelStep() {
  const [citySelected, setCitySelected] = useState("")
  const [load, setLoad] = useState(true)
  const dispatch = useDispatch()
  const cities = useSelector((state) => state.cities.cities)
  const city = useSelector((state) => state.cities.city)
  const [travelStepData, setTravelStepData] = useState({
    budget: "",
    numberOfDestination: "",
    allocationDestination: 50,
    CityId: "",
    DestinationIds: [],
  })
  const [travelStepCriteria, setTravelStepCriteria] = useState({
    budget: "",
    numberOfDestination: "",
    allocationDestination: 0,
    City: "",
    Destination: [],
    CityId: "",
    DestinationIds: []
  })
  const [topText, setTopText] = useState(false)
  const [showDest, setShowDest] = useState(false)
  const nav = useNavigate()
  function handleSubmit(e) {
    e.preventDefault();
    setLoad(true);
    dispatch(saveTravelStepCriteria(travelStepCriteria))
    dispatch(generateTravelStep(travelStepData)).then((res) => {
      setLoad(false)
      if (res === "ok") {
        nav("/travel-step/generated")
      }
    })
  }

  const onChangeHandler = (e) => {
    const updatedTravelStepData = {
      ...travelStepData,
      [e.target.name]: e.target.value,
    }
    setTravelStepData(updatedTravelStepData);
  }

  useEffect(() => {
    dispatch(fetchCities()).then((_) => {
      setLoad(false)
    })
  }, [])

  function showCity() {
    if (
      travelStepData.budget !== "" ||
      travelStepData.numberOfDestination !== ""
    ) {
      setTopText(!topText)
    }
  }

  function displayDest(cityName, CityId, citySlug) {
    setCitySelected(cityName)
    const updatedTravelStepData = { ...travelStepData, CityId }
    setTravelStepData(updatedTravelStepData)
    setTravelStepCriteria({...travelStepCriteria, City: cityName})
    setLoad(true)
    dispatch(fetchCity(citySlug)).then((_) => {
      setLoad(false)
      setShowDest(!showDest)
    })
  }

  function selectDest(destinationId, destinationName) {
    const updatedTravelStepData = { ...travelStepData };
    const updatedTravelStepCriteria = {...travelStepCriteria};
    const index = updatedTravelStepData.DestinationIds.findIndex(
      (el) => el === destinationId
    )
    if (index === -1) {
      updatedTravelStepData.DestinationIds.push(destinationId);
      updatedTravelStepCriteria.DestinationIds.push(destinationId);
      updatedTravelStepCriteria.Destination.push(destinationName);
    } else {
      updatedTravelStepData.DestinationIds.splice(index, 1);
      updatedTravelStepCriteria.DestinationIds.splice(index, 1);
      updatedTravelStepCriteria.Destination.splice(index, 1);
    }
    setTravelStepData(updatedTravelStepData);
    setTravelStepCriteria(updatedTravelStepCriteria);
  }

  useEffect(()=>{
    const updatedTravelStepCriteria = {...travelStepCriteria,
      budget: travelStepData.budget,
      CityId: travelStepData.CityId,
      numberOfDestination: travelStepData.numberOfDestination,
      allocationDestination: travelStepData.allocationDestination,}
    setTravelStepCriteria(updatedTravelStepCriteria);
  }, [travelStepData])

  function resetAll() {
    setTopText(false),
      setShowDest(false),
      setCitySelected(""),
      setTravelStepData({
        budget: "",
        numberOfDestination: "",
        allocationDestination: 50,
        CityId: "",
        DestinationIds: [],
      })
      setTravelStepCriteria({
        budget: "",
        numberOfDestination: "",
        allocationDestination: 0,
        City: "",
        Destination: [],
        CityId: "",
        DestinationIds: []
      })
  }

  if (load) {
    return <Loader />
  }
  return (
    <div className="md:overflow-hidden">
      <div className="flex flex-col xl:flex-row ease-in-out md:h-screen">
        <div
          className={`duration-100 ease-in-out min-h-screen md:h-auto relative ${topText ? "md:w-1/4" : "w-full"
            }`}>
          <div className="md:h-full">
            <img
              src="https://images.unsplash.com/photo-1611918126831-0a8352d6196f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
              alt=""
              className="w-full h-full object-cover brightness-50"
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center w-full h-full items-center gap-2 2xl:gap-24">
            <div
              onClick={resetAll}
              className={`pb-5 text-3xl border-b-2 border-white 2xl:text-7xl cursor-pointer`}>
              <h1 className="text-white font-semibold text-center">
                Preparing
              </h1>
              <div className="">
                <h1 className="text-white font-semibold">
                  <span className="font-light">the next</span> Travel
                </h1>
              </div>
            </div>
            <div
              className={`flex flex-col text-center bg-black h-fit bg-opacity-60 py-10 px-5 ${topText ? "gap-4" : " gap-7 "
                }`}>
              <div>
                <label
                  htmlFor="inputBudget"
                  className="xl:text-2xl background text-white">
                  Desired Budget :
                </label>
                <NumericFormat
                  value={travelStepData.budget}
                  prefix="Rp "
                  thousandSeparator="."
                  decimalSeparator=","
                  onValueChange={(values, sourceInfo) => {
                    setTravelStepData({...travelStepData, budget: values.floatValue})
                  }}
                  name="budget"
                  className="w-3/4 mx-auto shadow-md border-x-0 border-t-0 border-b-2 border-b-yelloku bg-transparent text-white text-center focus:ring-0 focus:border-b-yellow-100 font-medium xl:text-2xl placeholder:text-xl"
                  placeholder="ex. 25000000"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="inputBudget"
                  className="xl:text-2xl background text-white">
                  Total Destination :
                </label>
                <input
                  type="number"
                  id="inputBudget"
                  value={travelStepData.numberOfDestination}
                  onChange={onChangeHandler}
                  name="numberOfDestination"
                  className="w-3/4 mx-auto shadow-md border-x-0 border-t-0 border-b-2 border-b-yelloku bg-transparent text-white text-center focus:ring-0 focus:border-b-yellow-100 font-medium xl:text-2xl placeholder:text-xl"
                  placeholder="ex. 2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="rangeDest" className="text-white text-2xl">
                  Allocation
                </label>
                <div className="flex justitfy-between w-full text-white mb-2.5">
                  <h1 className="flex-1 text-xl">
                    Destination : {travelStepData.allocationDestination + "%"}
                  </h1>
                  <h1 className="flex-1 text-xl">
                    Hotel : {100 - travelStepData.allocationDestination + "%"}
                  </h1>
                </div>
                <input
                  id="rangeDest"
                  type="range"
                  onChange={onChangeHandler}
                  value={travelStepData.allocationDestination}
                  name="allocationDestination"
                  className="w-full mx-auto h-2.5 bg-white rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {topText ? (
                <div>
                  <button
                    className={`text-xl w-full mx-auto py-1.5 ${yellowButton}`}>
                    new budget
                  </button>
                </div>
              ) : (
                <button
                  onClick={showCity}
                  className={`text-xl font-medium w-full mx-auto py-2 ${yellowButton}`}>
                  choose city
                </button>
              )}
              {showDest ? (
                <h1 className="text-2xl font-medium text-white">
                  Destination in {citySelected}
                </h1>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div
          className={`mx-auto pl-2 pt-2 duration-200 ease-in-out bg-gray-50 ${topText ? "block md:w-3/4 w-full" : "hidden w-0"
            }`}>
          <div
            className={`md:h-screen ${showDest ? "w-0 hidden" : "w-full block overflow-y-auto"
              }`}
            id="scrollStyle">
            <div className="flex flex-wrap gap-2 justify-center mt-20 pb-10 ">
              {cities.map((el) => {
                return (
                  <div
                    className="max-w-xs aspect-square relative group cursor-pointer"
                    onClick={() => displayDest(el.name, el.id, el.slug)}
                    key={el.id}>
                    <img
                      src={el.image}
                      alt={el.name}
                      className="w-full h-full brightness-75 contrast-75 group-hover:brightness-100 duration-100"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                      <h1 className="text-white w-full text-2xl font-bold text-center px-2 capitalize">
                        {el.name}
                      </h1>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {showDest ? (
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="mt-20 pb-5 h-screen overflow-y-auto">
                <button
                  type="submit"
                  className="w-full text-lg font-medium underline text-black bg-yelloku py-3 mb-2 mx-auto block">
                  Generate
                </button>
                <div className="block w-full pb-24" id="scrollStyle">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {city.destination.map((el) => {
                      let classDestinationCard = ""
                      if (
                        travelStepData.DestinationIds.findIndex(
                          (destinationId) => destinationId === el.id
                        ) !== -1
                      ) {
                        classDestinationCard += "border border-8 border-yelloku"
                      }
                      return (
                        <div
                          className={`w-72 aspect-square ${classDestinationCard} relative group cursor-pointer`}
                          onClick={() => {
                            selectDest(el.id, el.name)
                          }}
                          key={el.id}>
                          <img
                            src={el.mainImg}
                            alt=""
                            className="w-full h-full brightness-75 group-hover:brightness-100 duration-100"
                          />
                          <div className="absolute inset-0 flex flex-col justify-end items-center">
                            <h1 className="text-yelloku bg-black w-full text-center">
                              {el.name}
                            </h1>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </form>
          ) : (
            ""
          )}
        </div>
      </div>
      <span
        className={`fixed bottom-3 flex items-center gap-1 text-white right-3 bg-black z-50 duration-200 cursor-pointer ${showDest ? "opacity-100" : "opacity-0"
          }`}
        onClick={resetAll}>
        <FaAngleDoubleLeft className="w-6 h-6 text-yelloku" />
        <h1 className="block text-xl font-semibold text-yelloku pr-2">Back</h1>
      </span>
    </div>
  )
}
