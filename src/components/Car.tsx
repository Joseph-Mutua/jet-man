import React, { useState, useEffect } from "react";

// Import your images
import sky from "../assets/images/sky3.jpg";
import city from "../assets/images/city.png";
import track from "../assets/images/track.png";
import carBody from "../assets/images/car_body.png";
import carWheelLeft from "../assets/images/car_wheel_left.png";
import carWheelRight from "../assets/images/car_wheel_right.png";

const Car: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);


  useEffect(() => {
    const city1 = document.getElementById("city1");
    const city2 = document.getElementById("city2");
    const track1 = document.getElementById("track1");
    const track2 = document.getElementById("track2");
    const carWheelLeft = document.getElementById("car_wheel_left");
    const carWheelRight = document.getElementById("car_wheel_right");
    const carBody = document.getElementById("car_body");


    if (isRunning) {
      city1!.style.animation = "city1 8s infinite linear reverse";
       city2!.style.animation = "city2 8s infinite linear reverse";
      track1!.style.animation = "road1 8s infinite linear reverse";
       track2!.style.animation = "road2 8s infinite linear reverse";
      carWheelLeft!.style.animation = "wheel 1s infinite linear";
      carWheelRight!.style.animation = "wheel 1s infinite linear";
      carBody!.style.animation = "car_body_animation 3s infinite ease-in-out";

    } else {
      city1!.style.animationPlayState = "paused";
      city2!.style.animationPlayState = "paused";
      track1!.style.animationPlayState = "paused";
      track2!.style.animationPlayState = "paused";
      carWheelLeft!.style.animationPlayState = "paused";
      carWheelRight!.style.animationPlayState = "paused";

    }

    return () => {

    };
  }, [isRunning]);

  return (
    <div>
      <img src={sky} id="sky" alt="sky" />
      <img src={city} id="city1" alt="city1" />
      <img src={city} id="city2" alt="city2" />
      <img src={track} id="track1" alt="track1" />
      <img src={track} id="track2" alt="track2" />
      <img src={carBody} id="car_body" alt="car body" />
      <img src={carWheelLeft} id="car_wheel_left" alt="car wheel left" />
      <img src={carWheelRight} id="car_wheel_right" alt="car wheel right" />

      <div style={{}}><h1>Heey</h1></div>
      <button type="button" onClick={() => setIsRunning(true)}>
        START
      </button>
      <button type="button" onClick={() => setIsRunning(false)}>
        STOP
      </button>
      <audio id="audio">
        <source src="sound.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default Car;
