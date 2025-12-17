import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Clock, Users, TrendingUp, MapPin, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Book Your Court in Seconds</h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100">
              Premium badminton courts with professional coaches and equipment rental. 
              Dynamic pricing, instant booking, and smart availability.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:space-x-4">
              <Link to="/courts" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base">
                  <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Browse Courts
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base bg-white text-blue-600 hover:bg-gray-100">
                  Login / Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                <CardTitle className="text-lg sm:text-xl">Instant Booking</CardTitle>
                <CardDescription>
                  Real-time availability checking across courts, coaches, and equipment. Book everything in one transaction.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                <CardTitle className="text-lg sm:text-xl">Dynamic Pricing</CardTitle>
                <CardDescription>
                  Smart pricing based on peak hours, weekends, and court type. Get discounts during off-peak hours.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                <CardTitle className="text-lg sm:text-xl">Professional Coaches</CardTitle>
                <CardDescription>
                  Book expert coaches with your court session. Choose from multiple specialties and experience levels.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">4</div>
              <div className="text-base sm:text-lg text-gray-600">Premium Courts</div>
              <div className="text-xs sm:text-sm text-gray-500">2 Indoor • 2 Outdoor</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">3</div>
              <div className="text-base sm:text-lg text-gray-600">Expert Coaches</div>
              <div className="text-xs sm:text-sm text-gray-500">All Certified Professionals</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">16</div>
              <div className="text-base sm:text-lg text-gray-600">Hours Open Daily</div>
              <div className="text-xs sm:text-sm text-gray-500">6 AM - 10 PM</div>
            </div>
          </div>
        </div>
      </section>

      {/* Court Types Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Our Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary" />
                  Indoor Courts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" />
                    Air Conditioned
                  </li>
                  <li className="flex items-center text-sm sm:text-base">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" />
                    LED Lighting
                  </li>
                  <li className="flex items-center text-sm sm:text-base">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" />
                    Premium Flooring
                  </li>
                  <li className="text-xl sm:text-2xl font-bold mt-4 text-primary">
                    ₹500/hour
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary" />
                  Outdoor Courts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" />
                    Natural Lighting
                  </li>
                  <li className="flex items-center text-sm sm:text-base">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" />
                    Fresh Air Environment
                  </li>
                  <li className="flex items-center text-sm sm:text-base">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" />
                    Quality Surfaces
                  </li>
                  <li className="text-xl sm:text-2xl font-bold mt-4 text-primary">
                    ₹300/hour
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100">
            Book your court now and enjoy premium facilities at competitive prices
          </p>
          <Link to="/courts">
            <Button size="lg" variant="secondary" className="h-11 sm:h-12 text-sm sm:text-base">
              <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Book Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
