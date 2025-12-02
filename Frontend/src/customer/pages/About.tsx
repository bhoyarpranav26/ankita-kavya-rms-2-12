import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaStar, FaClock, FaUtensils } from 'react-icons/fa'

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to FlavorFusion
              </h1>
              <p className="lead mb-4">
                Experience culinary excellence with our diverse menu featuring the finest ingredients
                and exceptional service. Order now and taste the difference!
              </p>
              <Link to="/menu" className="btn btn-light btn-lg px-4 py-3 fw-bold">
                Order Now <FaArrowRight className="ms-2" />
              </Link>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600"
                alt="Delicious food"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold text-primary">Why Choose Us?</h2>
              <p className="lead text-muted">Experience dining like never before</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <FaStar className="text-warning fs-1 mb-3" />
                  <h5 className="card-title fw-bold">Premium Quality</h5>
                  <p className="card-text text-muted">
                    We use only the finest ingredients to ensure every dish meets our high standards.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <FaClock className="text-primary fs-1 mb-3" />
                  <h5 className="card-title fw-bold">Fast Delivery</h5>
                  <p className="card-text text-muted">
                    Quick preparation and delivery to get your food hot and fresh to your door.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <FaUtensils className="text-success fs-1 mb-3" />
                  <h5 className="card-title fw-bold">Diverse Menu</h5>
                  <p className="card-text text-muted">
                    From starters to desserts, we offer a wide variety of cuisines to satisfy every taste.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Order?</h2>
          <p className="lead mb-4">
            Browse our menu and place your order in just a few clicks.
          </p>
          <Link to="/menu" className="btn btn-light btn-lg px-5 py-3 fw-bold">
            View Menu <FaArrowRight className="ms-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home