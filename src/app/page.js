import { CLIENT_REFERENCE_MANIFEST } from "next/dist/shared/lib/constants";
import Image from "next/image";
import Link from 'next/link'
import styles from '../app/styles/home.css';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="heroSection">
        <div className="overlay"></div>
        <Image
          src="/home.png"
          alt="Hero Background" 
          layout="fill"
          objectFit="cover"
          quality={100}
          className="heroImage"
        />
        <div className="heroContent">
          <h1 className="heroTitle">Tanken-Go</h1>
          <p className="heroSubtitle">Explore more trips for your next trip idea!</p>
          <Link href='/explore'><button className="heroButton">Start Planning</button></Link>
        </div>
      </div>

      {/* Trip Planners Section */}
      <div className="tripPlannersSection">
        <h2 className="sectionTitle">Trip Planners</h2>
        <p className="sectionSubtitle">
          Explore inspiring travel plans created by fellow travelers. Discover new destinations, get ideas for your next
          adventure, and customize a plan that suits your style. Start your journey today by browsing through the best trip planners!
        </p>
        <button className="viewPlansButton">View all trip plans</button>
        <div className="tripCards">
          <div className="tripCard">
            <Image
              src="/Colosseo.png"
              alt="Rome"
              width={300}
              height={200}
              className="tripCardImage"
            />
            <h3 className="tripCardTitle">Rome</h3>
            <p className="tripPrice">€70/Day</p>
            <p className="tripDuration">5 Days Tour</p>
          </div>
          <div className="tripCard">
            <Image
              src="/eiffel.png"
              alt="Paris"
              width={300}
              height={200}
              className="tripCardImage"
            />
            <h3 className="tripCardTitle">Paris City Tour</h3>
            <p className="tripPrice">€99/Day</p>
            <p className="tripDuration">7 Days Tour</p>
          </div>
          <div className="tripCard">
            <Image
              src="/madrid.png"
              alt="Madrid"
              width={300}
              height={200}
              className="tripCardImage"
            />
            <h3 className="tripCardTitle">Madrid</h3>
            <p className="tripPrice">€50/Day</p>
            <p className="tripDuration">3 Days Tour</p>
          </div>
        </div>
      </div>

      {/* Traveler's Experiences Section */}
      <div className="travelersExperiences">
        <h2 className="sectionTitle">Traveler’s Experiences</h2>
        <p className="sectionSubtitle">Here are some awesome feedback from our travelers</p>
        <div className="experienceCard">
          <div className="profileImage">
            <Image
              src="/traveller.png"
              alt="Traveler"
              width={100}
              height={100}
              className="profileImg"
            />
          </div>
          <div className="feedbackContent">
            <p className="feedbackText">
              Using Tanken GO made planning my trip so much easier! The personalized itinerary suggestions and the
              user-friendly interface saved me a lot of time and stress. I loved being able to customize everything
              to my preferences, and the entire process felt seamless. Highly recommend Tanken GO!
            </p>
            <div className="feedbackRating">
              <span>⭐⭐⭐⭐⭐</span>
            </div>
            <p className="travelerName">John Doe</p>
          </div>
        </div>
      </div>
    </div>
  );
}
