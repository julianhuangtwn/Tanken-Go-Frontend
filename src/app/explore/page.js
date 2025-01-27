// app/explore/page.js

import Image from 'next/image';
import styles from '../explore/explore.css';
import Link from 'next/link'

export default function Explore() {
  return (
    <div className="exploreContainer">
      <div className="textSection">
        <p className="subtitle">Discover your next adventure with ease!</p>
        <h1 className="title">Start Planning Your Dream Trip!</h1>
        <p className="description">
          Ask our AI for personalized suggestions and uncover must-see attractions. 
          Customize your journey to make every moment unforgettable!
        </p>
        <Link href="/explore/plan-ai"><button className="askAIButton">Ask AI</button></Link>
      </div>
      <div className="imageSection">
        <div className="imageWrapper">
          <Image
            src="/Explore.png"
            alt="Explore"
            width={400}
            height={400}
            className="circleImage"
          />
        </div>
      </div>
    </div>
  );
}

  
  