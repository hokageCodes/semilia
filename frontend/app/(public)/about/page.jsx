'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import { Heart, Users, Award, Globe, Star, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: '500+', label: 'Happy Customers', icon: Users },
    { number: '5+', label: 'Years in Business', icon: CheckCircle },
    { number: '5+', label: 'Countries Served', icon: Globe },
    { number: '4.8', label: 'Customer Rating', icon: Star },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion for Fashion',
      description: 'We believe fashion is a form of self-expression and art. Every piece we create tells a story.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Our customers are at the heart of everything we do. We build lasting relationships, not just transactions.'
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'We never compromise on quality. Every garment is crafted with attention to detail and premium materials.'
    },
    {
      icon: Globe,
      title: 'Sustainable Fashion',
      description: 'We\'re committed to ethical practices and sustainable fashion that respects our planet and people.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Creative Director',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
      bio: 'With over 15 years in fashion design, Sarah founded SEMILIA to bring authentic African-inspired fashion to the world.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      bio: 'Michael leads our design team, bringing fresh perspectives and innovative approaches to traditional fashion.'
    },
    {
      name: 'Aisha Okafor',
      role: 'Sustainability Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      bio: 'Aisha ensures our practices align with our commitment to sustainable and ethical fashion.'
    }
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-black text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Story</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Born from a passion for authentic African fashion, SEMILIA brings you 
              contemporary designs that celebrate culture, quality, and style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="px-8 py-4 bg-yellow text-black rounded-lg font-semibold hover:bg-yellow/90 transition-colors"
              >
                Shop Our Collection
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-black" />
                </div>
                <div className="text-3xl font-bold text-black mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">How It All Began</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  SEMILIA was born from a simple yet powerful vision: to bridge the gap between 
                  traditional African fashion and contemporary global style. Our founder, Sarah Johnson, 
                  spent years traveling across Africa, studying traditional textiles and modern design.
                </p>
                <p>
                  What started as a small collection of handcrafted pieces has grown into a 
                  global fashion brand that celebrates the rich heritage of African design while 
                  meeting the demands of modern life.
                </p>
                <p>
                  Today, we're proud to serve customers worldwide, offering everything from 
                  elegant Adire dresses to contemporary men's wear, all crafted with the same 
                  attention to detail and cultural authenticity that started our journey.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                alt="Our Story"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-yellow p-6 rounded-2xl shadow-lg">
                <div className="text-2xl font-bold text-black">Since 2020</div>
                <div className="text-black/80">Crafting Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do, from design to customer service
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-yellow rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      {/* <div className="py-20 bg-cream">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind SEMILIA's success
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="relative h-80">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-yellow font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Mission Section */}
      <div className="py-20 bg-black text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              To democratize authentic African fashion by making it accessible, 
              sustainable, and relevant to the modern global consumer while 
              preserving the cultural integrity and craftsmanship of traditional designs.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <CheckCircle className="w-12 h-12 text-yellow mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Authentic Design</h3>
                <p className="text-gray-400">True to cultural roots</p>
              </div>
              <div>
                <CheckCircle className="w-12 h-12 text-yellow mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Quality Craftsmanship</h3>
                <p className="text-gray-400">Built to last</p>
              </div>
              <div>
                <CheckCircle className="w-12 h-12 text-yellow mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Global Reach</h3>
                <p className="text-gray-400">Available worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-yellow">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to Experience SEMILIA?</h2>
          <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered the perfect blend 
            of tradition and modernity in our fashion collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
            >
              Start Shopping
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

