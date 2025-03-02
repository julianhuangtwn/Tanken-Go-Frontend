// app/explore/page.js

import Image from 'next/image';
import styles from '../explore/explore.css';
import Link from 'next/link'

export default function Explore() {
  return (
    <div className="exploreContainer flex md:flex-row items-center mx-auto max-w-7xl px-6">
      {/* Text Section */}
      <div className="textSection w-auto text-center md:text-left">
        <p className="subtitle">Discover your next adventure with ease!</p>
        <h1 className="title">Start Planning Your Dream Trip!</h1>
        <p className="description">
          Ask our AI for personalized suggestions and uncover must-see attractions. 
          Customize your journey to make every moment unforgettable!
        </p>
        <Link href="/explore/plan-ai">
          <button className="askAIButton">Ask AI</button>
        </Link>
      </div>

      {/* Image Section */}
      <div className="imageSection flex-1 flex justify-center items-center">
        <div className="imageWrapper relative md:w-1/2">
          <Image
            src="/Explore.png"
            alt="Explore"
            fill
            className="circleImage object-cover"
          />
        </div>
      </div>
    </div>
)};

  
  