import { useState, useEffect } from "react";

//import axios
import axios from "axios";

//import icons
import {
	IoMdSunny,
	IoMdCloudy,
	IoMdRainy,
	IoMdSnow,
	IoMdThunderstorm,
	IoMdSearch,
} from "react-icons/io";

import {
	BsCloudHaze2Fill,
	BsCloudDrizzleFill,
	BsEye,
	BsWater,
	BsThermometer,
	BsWind,
} from "react-icons/bs";

import { TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

//api key
const APIkey = "17c6072dd30722149471605547128ece";

function App() {
	const [data, SetData] = useState();
	const [location, SetLocation] = useState("Accra");
	const [inputValue, setInputValue] = useState("");
	const [animate, setAnimate] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	//handle Search
	const handleInput = (e) => {
		setInputValue(e.target.value);
	};

	const handleSubmit = (e) => {
		console.log(inputValue);
		//if input value is not empty
		if (inputValue !== "") {
			SetLocation(inputValue);
		}

		//select input
		const input = document.querySelector("input");

		//if input value is empty
		if (input.value === "") {
			//set animate to true
			setAnimate(true);
			//after 500ms set animate to false
			setTimeout(() => {
				setAnimate(false);
			}, 500);
		}
		//clear input
		input.value = "";

		//prevent defaults
		e.preventDefault();
	};

	
	//fetch data
	useEffect(() => {
		// set loading to true
		setLoading(true);
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIkey}`;

		axios.get(url).then((res) => {
			//set the data after 1500ms
			setTimeout(() => {
				SetData(res.data);
				//set loading to false
				setLoading(false);
			}, 1500);
		}).catch(err => {
			setLoading(false)
			setError(err)
		});
	}, [location]);

	//error message
	useEffect(() => {
		const timer = setTimeout(() => {
			setError('')
		}, 2000)
		
		return ()=> clearTimeout(timer)
	},[error])

	if (!data) {
		return (
			<div className="bg-amber-300">
				<div className="flex items-center justify-center h-screen text-white" >
					<ImSpinner8 className="text-3xl animate-spin" />
				</div>
			</div>
		);
	}

	//set icon according to the weather
	let icon;
	// console.log(data.weather[0].main);

	switch (data.weather[0].main) {
		case "Clouds":
			icon = <IoMdCloudy />;
			break;
		case "Haze":
			icon = <BsCloudHaze2Fill />;
			break;
		case "Rain":
			icon = <IoMdRainy className="text-[#31cafb]" />;
			break;
		case "Clear":
			icon = <IoMdSunny className="text-[#ffde33]" />;
			break;
		case "Drizzle":
			icon = <BsCloudDrizzleFill className="text-[#31cafb]" />;
			break;
		case "Thunderstorm":
			icon = <IoMdThunderstorm />;
			break;
		case "Snow":
			icon = <IoMdSnow className="text-[#31cafb]" />;
			break;
	}

	const date = new Date();
	return (
		<>
			<div className="flex flex-col items-center justify-center w-full min-h-screen px-4 bg-amber-400">
				{/* form  */}
				{error && <div className="w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff2032] text-white absolute top-2 lg:top-10 p-4 capitalize rounded-md">{ `${error.response.data.message}`}</div>
				}
				<form
					className={`${
						animate ? "animate-bounce " : "animate-none"
					} flex items-center justify-between w-full max-w-md pl-6 pr-2 mb-5 text-white rounded-full bg-black/20 h-14 backdrop-blur-[32px]`}
				>
					<div className="flex justify-between text-white">
						<input
							onChange={(e) => handleInput(e)}
							type="text"
							name=""
							id=""
							placeholder="Search by city or country"
							className="flex-1 h-full text-lg font-light outline-none placeholder:text-white"
						/>
					</div>
					<button
						onClick={(e) => handleSubmit(e)}
						className="flex items-center justify-center w-20 transition rounded-full h-11 bg-amber-300 hover:bg-amber-400"
					>
						<IoMdSearch size={32} />
					</button>
				</form>

				{/* card */}
				<div className="w-full max-w-md text-white xl:max-w-xl bg-black/20 min-h-[584px] backdrop-blur-[32px] rounded-2xl py-12 px-6">
					{loading ? (
						<div className="flex items-center justify-center w-full h-full">
							<ImSpinner8 className="text-3xl animate-spin" />
						</div>
					) : (
						<div>
							{/* card top */}
							<div className="flex items-center space-x-5 ">
								{/* icon   */}
								<div className="text-6xl">{icon}</div>

								<div>
									{/* country name  */}
									<div className="text-xl font-semibold">
										{data.name}, {data.sys.country}
										{/* country, country */}
									</div>

									{/* date  */}
									<div>
										{date.getUTCDate()}/{date.getUTCMonth() + 1}/
										{date.getUTCFullYear()}
									</div>
								</div>
							</div>

							{/* card body  */}
							<div className=" my-15">
								<div className="flex items-center justify-center">
									{/* temp  */}
									<div className="font-light leading-none text-9xl">
										{parseInt(data.main.temp)}
									</div>
									{/* celsius  */}
									<div className="text-2xl">
										<TbTemperatureCelsius />
									</div>
								</div>

								{/* weather description  */}
								<div className="mt-3 text-lg text-center capitalize">
									{data.weather[0].description}
									{/* clear sky */}
								</div>
							</div>
							{/* card bottom  */}
							<div className="mt-30">
								<div className="grid grid-cols-2 gap-4 space-x-2 place-items-center">
									{/* Visibility */}
									<div className="flex items-center gap-x-2">
										<BsEye />
										<div>Visibility</div>
										<div>{data.visibility / 1000} km</div>
									</div>
									{/* Temperature */}
									<div className="flex items-center gap-x-2">
										<BsThermometer />
										<div>Feels like</div>
										<div>{parseInt(data.main.feels_like)}</div>
										<TbTemperatureCelsius />
									</div>
									{/* Humidity */}
									<div className="flex items-center gap-x-2">
										<BsWater />
										<div>Humidity</div>
										<div>{data.main.humidity}%</div>
									</div>
									{/* Wind  */}
									<div className="flex items-center gap-x-2">
										<BsWind />
										<div>Wind</div>
										<div>{data.wind.speed}m/s</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default App;
