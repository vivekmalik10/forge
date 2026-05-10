"use client";
import classNames from "classnames";
import { useState } from "react";
import Image from "next/image";
import Backatcha from "@/assets/images/backatcha.gif";

const sarcasticTryAgainTexts = [
  "",
  "Try again 🙂",
  "Nope, missed it 😅",
  "Almost. Not really 😏",
  "You thought that would work? 🤨",
  "Interesting strategy. Wrong, but interesting 🤔",
  "Wow, still going? 😌",
  "Okay, I admire the confidence 😎",
  "You do realize the button is faster than you, right? 🏃‍♂️💨",
  "At this point, it’s kind of impressive 👏",
  "Persistence is great. This, however, is not working 😬",
  "I could stop moving… but where’s the fun in that? 😈",
  "You’re really committed to this bit, huh? 🤡",
  "Trust me, you’re not clicking this 🚫",
  "Stubbornness detected. Success not detected 🧠❌",
  "Alright. I respect the effort. But no. 😌🔥",
];

const ArrowIcon = () =>  (

    <svg width="40px" height="40px" viewBox="0 0 24 24" fill="inherit" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

const DynamicTextContainer = ({ text }: { text: string }) => {
  const [buttonPosition, setButtonPosition] = useState({
    top: "0px",
    left: "0px",
  });
  const [count, setCount] = useState(0);
  const [clickedYes, setClickedYes] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setButtonPosition({
      top: Math.random() * 100 + "px",
      left: Math.random() * 100 + "px",
    });
    setCount((prev) => prev + 1);
  };

  if(clickedYes)
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Image src={Backatcha} alt="Backatcha" width={400} height={400} />
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <h2>{sarcasticTryAgainTexts[count > 16 ? count % 16 : count]}</h2>
      <div className="py-3 px-5 md:py-5 md:px-12 border border-zinc-200 dark:border-zinc-800 rounded-lg mt-7">
        <h1>{text}</h1>
        <div className="flex gap-2 justify-around mt-2 items-center">
          <div className="relative">
            <button className={classNames("btn btn-primary h-fit text-lg ", { "vibrate-once": !!count && count % 2 === 0 })} onClick={() => setClickedYes(true)}>Yes</button>

            <div className={classNames("absolute hidden left-0 text-black dark:text-white justify-center flex-col items-center", { "!flex": !!count && count % 2 === 0 })}>
                <ArrowIcon />
                <span>Try me!</span>
            </div>
            </div>
          <div
            onMouseMove={handleMouseMove}
            className="p-2 relative"
            style={{ top: buttonPosition.top, left: buttonPosition.left }}
          >
            <button className="btn btn-secondary text-lg">No</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicTextContainer;

