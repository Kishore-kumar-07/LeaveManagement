import React from "react";
import arrow from "../../images/forward.png";
function OptionsCard(props) {
  return (
    <div
      onClick={() => props.setOption(props.value)}
      className="w-full text-xl  flex items-center gap-4 p-10 text-center border-2 border-cyan-100 bg-white shadow-sm rounded-xl cursor-pointer"
    >
      <div className="flex w-full items-center gap-5">
        <div className="bg-cyan-200 text-cyan-500 p-3 rounded-full">
          {props.icon}
        </div>
        {props.name}
      </div>
      <img src={arrow} alt="image" width={40} height={40}></img>
    </div>
  );
}

export default OptionsCard;
