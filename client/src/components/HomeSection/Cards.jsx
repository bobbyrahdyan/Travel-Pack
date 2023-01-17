import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Cards({ type, cities, destinations }) {
  const nav = useNavigate()

  function handleNavCity(slug) {
    nav(`/find-byCity/${slug}/destination`)
  }
  function handleNavDestination(slug) {
    nav(`/destination/${slug}`)
  }

  useEffect(() => {}, [])
  if (type === "city") {
    return (
      <section className="grid px-2 mt-3 xl:grid-cols-4 gap-2">
        {cities.map((el) => {
          return (
            <div className="cursor-pointer overflow-hidden group" key={el.id}>
              <div
                key={el.id}
                className="aspect-square duration-300 ease-out overflow-hidden cursor-pointer relative"
                onClick={() => {
                  handleNavCity(el.slug)
                }}>
                <img
                  className="object-cover h-full w-full duration-300 brightness-110 contrast-125 scale-105 group-hover:scale-100"
                  src={el.image}
                  alt={el.name}
                />
                <div className="absolute inset-0 flex w-full h-full backdrop-brightness-75 backdrop-contrast-75 items-center justify-center">
                  <h1 className="text-white font-bold text-4xl text-center w-full block pl-5 py-2 capitalize">
                    {el.name}
                  </h1>
                </div>
              </div>
            </div>
          )
        })}
      </section>
    )
  }
  if (type === "destination") {
    return (
      <section className="cursor-pointer grid px-2 mt-3 md:grid-cols-5 gap-7 overflow-hidden py-3">
        {destinations.map((el) => {
          const currencyFormat = el.cost.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })
          return (
            <div
              className="overflow-hidden relative group h-[400px] shadow-md"
              key={el.id}
              onClick={() => {
                handleNavDestination(el.slug)
              }}>
              <div
                key={el.id}
                className="duration-300 ease-out cursor-pointer h-full group-hover:scale-105  ">
                <img
                  className="object-cover h-full w-full contrast-125 group-hover:scale-105 duration-700"
                  src={el.mainImg}
                  alt={el.name}
                />
              </div>
              <div className="absolute inset-0 flex w-full h-full items-end duration-200">
                <div className="flex w-full justify-between px-3 py-5 gap-10 bg-white">
                  <h1 className="text-black text-lg duration-200 truncate capitalize">{el.name}</h1>
                  <h1 className="text-red-500">
                  {currencyFormat}
                  </h1>
                </div>
              </div>
            </div>
          )
        })}
      </section>
    )
  }
}
